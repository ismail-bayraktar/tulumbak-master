import DeadLetterQueueModel from '../models/DeadLetterQueueModel.js';
import orderModel from '../models/OrderModel.js';
import CourierIntegrationConfigModel from '../models/CourierIntegrationConfigModel.js';
import logger from '../utils/logger.js';

/**
 * RetryService
 * Manages retry logic with exponential backoff for failed operations
 * Handles moving to Dead Letter Queue after max retries
 */

class RetryService {
    constructor() {
        // In-memory retry queue for performance
        // In production, consider using Redis for distributed systems
        this.retryQueue = new Map();
        this.activeRetries = new Map();
        this.initialized = false;
    }

    /**
     * Initialize retry service
     */
    async initialize() {
        if (this.initialized) return;

        try {
            // Start background processor for retries
            this.startRetryProcessor();

            // Clean up old DLQ items periodically
            this.startDLQCleanup();

            this.initialized = true;
            logger.info('RetryService initialized successfully');
        } catch (error) {
            logger.error('Failed to initialize RetryService', {
                error: error.message,
                stack: error.stack
            });
            throw error;
        }
    }

    /**
     * Calculate exponential backoff delay with jitter
     * @param {number} retryCount - Current retry attempt
     * @param {object} config - Retry configuration
     * @returns {number} Delay in milliseconds
     */
    calculateBackoff(retryCount, config = {}) {
        const baseDelay = config.baseDelay || 1000; // 1 second default
        const maxDelay = config.maxDelay || 300000; // 5 minutes default
        const jitterFactor = config.jitterFactor || 0.1; // 10% jitter

        // Exponential backoff: 2^n * baseDelay
        let delay = Math.pow(2, retryCount) * baseDelay;

        // Cap at maxDelay
        delay = Math.min(delay, maxDelay);

        // Add jitter to prevent thundering herd
        const jitter = delay * jitterFactor * Math.random();
        delay = Math.floor(delay + jitter);

        logger.debug('Calculated backoff delay', {
            retryCount,
            delay,
            baseDelay,
            maxDelay
        });

        return delay;
    }

    /**
     * Schedule a retry for a failed operation
     */
    async scheduleRetry(orderId, platform, operation, payload, currentRetryCount = 0) {
        try {
            // Get retry configuration
            const config = await this.getRetryConfig(platform);

            // Check if we've exhausted retries
            if (currentRetryCount >= config.maxRetries) {
                logger.warn('Max retries exhausted, moving to DLQ', {
                    orderId,
                    platform,
                    operation,
                    retryCount: currentRetryCount,
                    maxRetries: config.maxRetries
                });

                return await this.moveToDeadLetterQueue(
                    orderId,
                    platform,
                    operation,
                    payload,
                    new Error(`Max retries (${config.maxRetries}) exhausted`)
                );
            }

            // Calculate backoff delay
            const delay = this.calculateBackoff(currentRetryCount, config);

            // Create retry entry
            const retryId = `${platform}_${orderId}_${operation}_${Date.now()}`;
            const retryAt = Date.now() + delay;

            const retryEntry = {
                retryId,
                orderId,
                platform,
                operation,
                payload,
                retryCount: currentRetryCount + 1,
                maxRetries: config.maxRetries,
                scheduledAt: Date.now(),
                retryAt,
                status: 'scheduled'
            };

            // Add to retry queue
            this.retryQueue.set(retryId, retryEntry);

            // Update order with retry info
            await orderModel.findByIdAndUpdate(orderId, {
                'courierIntegration.retryCount': currentRetryCount + 1,
                'courierIntegration.syncStatus': 'pending',
                'courierIntegration.lastSyncAt': Date.now()
            });

            logger.info('Retry scheduled', {
                orderId,
                platform,
                operation,
                retryCount: currentRetryCount + 1,
                delay,
                retryAt: new Date(retryAt).toISOString()
            });

            return {
                success: true,
                retryId,
                retryAt,
                retryCount: currentRetryCount + 1
            };

        } catch (error) {
            logger.error('Failed to schedule retry', {
                orderId,
                platform,
                operation,
                error: error.message
            });
            throw error;
        }
    }

    /**
     * Execute a retry
     */
    async executeRetry(retryId) {
        const retryEntry = this.retryQueue.get(retryId);
        if (!retryEntry) {
            logger.warn('Retry entry not found', { retryId });
            return null;
        }

        // Check if already being processed
        if (this.activeRetries.has(retryId)) {
            logger.warn('Retry already in progress', { retryId });
            return null;
        }

        try {
            // Mark as active
            this.activeRetries.set(retryId, Date.now());
            retryEntry.status = 'processing';

            const { orderId, platform, operation, payload, retryCount } = retryEntry;

            logger.info('Executing retry', {
                orderId,
                platform,
                operation,
                retryCount,
                retryId
            });

            // Import dynamically to avoid circular dependencies
            const MuditaKuryeService = (await import('./MuditaKuryeService.js')).default;

            // Execute operation based on type
            let result;
            switch (operation) {
                case 'submit_order':
                    if (platform === 'muditakurye') {
                        result = await MuditaKuryeService.createOrder(payload);
                    } else {
                        throw new Error(`Unknown platform: ${platform}`);
                    }
                    break;

                case 'update_status':
                    if (platform === 'muditakurye') {
                        result = await MuditaKuryeService.updateOrderStatus(
                            payload.externalOrderId,
                            payload.status,
                            payload.additionalData
                        );
                    } else {
                        throw new Error(`Unknown platform: ${platform}`);
                    }
                    break;

                case 'cancel_order':
                    if (platform === 'muditakurye') {
                        result = await MuditaKuryeService.cancelOrder(
                            payload.externalOrderId,
                            payload.reason
                        );
                    } else {
                        throw new Error(`Unknown platform: ${platform}`);
                    }
                    break;

                default:
                    throw new Error(`Unknown operation: ${operation}`);
            }

            // Check if operation succeeded
            if (result.success) {
                // Success! Clean up and update order
                this.retryQueue.delete(retryId);
                this.activeRetries.delete(retryId);

                await orderModel.findByIdAndUpdate(orderId, {
                    'courierIntegration.syncStatus': 'synced',
                    'courierIntegration.retryCount': 0,
                    'courierIntegration.lastSyncAt': Date.now(),
                    'courierIntegration.externalOrderId': result.externalOrderId || payload.externalOrderId
                });

                logger.info('Retry succeeded', {
                    orderId,
                    platform,
                    operation,
                    retryCount,
                    retryId
                });

                return { success: true, result };

            } else {
                // Failed again
                this.activeRetries.delete(retryId);
                this.retryQueue.delete(retryId);

                // Check if error is retryable
                if (result.error?.retryable) {
                    // Schedule next retry
                    return await this.scheduleRetry(
                        orderId,
                        platform,
                        operation,
                        payload,
                        retryCount
                    );
                } else {
                    // Non-retryable error, move to DLQ
                    logger.warn('Non-retryable error, moving to DLQ', {
                        orderId,
                        error: result.error
                    });

                    return await this.moveToDeadLetterQueue(
                        orderId,
                        platform,
                        operation,
                        payload,
                        result.error
                    );
                }
            }

        } catch (error) {
            // Execution error
            this.activeRetries.delete(retryId);
            this.retryQueue.delete(retryId);

            logger.error('Retry execution failed', {
                retryId,
                error: error.message,
                stack: error.stack
            });

            // Schedule next retry or move to DLQ
            if (retryEntry.retryCount < retryEntry.maxRetries) {
                return await this.scheduleRetry(
                    retryEntry.orderId,
                    retryEntry.platform,
                    retryEntry.operation,
                    retryEntry.payload,
                    retryEntry.retryCount
                );
            } else {
                return await this.moveToDeadLetterQueue(
                    retryEntry.orderId,
                    retryEntry.platform,
                    retryEntry.operation,
                    retryEntry.payload,
                    error
                );
            }
        }
    }

    /**
     * Move failed operation to Dead Letter Queue
     */
    async moveToDeadLetterQueue(orderId, platform, operation, payload, error) {
        try {
            // Create DLQ entry
            const dlqItem = new DeadLetterQueueModel({
                orderId,
                platform,
                operation,
                payload,
                lastError: {
                    message: error.message || 'Unknown error',
                    code: error.code || 'UNKNOWN',
                    statusCode: error.statusCode,
                    timestamp: Date.now(),
                    stack: error.stack
                },
                retryCount: payload.retryCount || 0,
                status: 'pending',
                priority: this.determinePriority(operation, payload),
                metadata: {
                    orderNumber: payload.orderId,
                    customerName: payload.customerName || payload.address?.name,
                    customerPhone: payload.customerPhone || payload.address?.phone,
                    amount: payload.amount,
                    branchId: payload.branchId,
                    correlationId: payload.correlationId
                },
                lastAttemptAt: Date.now()
            });

            await dlqItem.save();

            // Update order status
            await orderModel.findByIdAndUpdate(orderId, {
                'courierIntegration.syncStatus': 'failed',
                'courierIntegration.failureReason': error.message
            });

            // Send admin notification
            this.notifyAdmins(dlqItem);

            logger.error('Operation moved to Dead Letter Queue', {
                orderId,
                platform,
                operation,
                dlqId: dlqItem._id,
                error: error.message
            });

            return {
                success: false,
                dlqId: dlqItem._id,
                error: error.message
            };

        } catch (dlqError) {
            logger.error('Failed to move to DLQ', {
                orderId,
                error: dlqError.message
            });
            throw dlqError;
        }
    }

    /**
     * Get retry configuration for a platform
     */
    async getRetryConfig(platform) {
        try {
            const config = await CourierIntegrationConfigModel.findOne({ platform });

            return {
                maxRetries: config?.retryConfig?.maxRetries || 5,
                baseDelay: config?.retryConfig?.baseDelay || 1000,
                maxDelay: config?.retryConfig?.maxDelay || 300000,
                jitterFactor: 0.1
            };
        } catch (error) {
            // Return defaults if config fetch fails
            return {
                maxRetries: 5,
                baseDelay: 1000,
                maxDelay: 300000,
                jitterFactor: 0.1
            };
        }
    }

    /**
     * Determine priority for DLQ item
     */
    determinePriority(operation, payload) {
        // High priority for large orders or critical operations
        if (payload.amount > 500) return 'high';
        if (operation === 'submit_order' && payload.paymentMethod === 'ONLINE_PREPAID') return 'high';
        if (operation === 'cancel_order') return 'high';

        // Medium priority for most operations
        if (operation === 'submit_order') return 'medium';
        if (operation === 'update_status') return 'medium';

        // Low priority for others
        return 'low';
    }

    /**
     * Notify admins about DLQ entry
     */
    async notifyAdmins(dlqItem) {
        // TODO: Implement admin notification
        // This could be email, SMS, or in-app notification
        logger.info('Admin notification would be sent', {
            dlqId: dlqItem._id,
            orderId: dlqItem.orderId,
            platform: dlqItem.platform
        });
    }

    /**
     * Start background processor for retries
     */
    startRetryProcessor() {
        setInterval(() => {
            const now = Date.now();

            for (const [retryId, entry] of this.retryQueue.entries()) {
                // Skip if not ready or already processing
                if (entry.retryAt > now || entry.status === 'processing') {
                    continue;
                }

                // Execute retry asynchronously
                this.executeRetry(retryId).catch(error => {
                    logger.error('Background retry execution failed', {
                        retryId,
                        error: error.message
                    });
                });
            }
        }, 5000); // Check every 5 seconds
    }

    /**
     * Start DLQ cleanup job
     */
    startDLQCleanup() {
        // Run daily at 2 AM
        setInterval(async () => {
            try {
                const result = await DeadLetterQueueModel.cleanOldItems(30); // Clean items older than 30 days
                logger.info('DLQ cleanup completed', {
                    deletedCount: result.deletedCount
                });
            } catch (error) {
                logger.error('DLQ cleanup failed', {
                    error: error.message
                });
            }
        }, 24 * 60 * 60 * 1000); // Run once per day
    }

    /**
     * Get retry queue statistics
     */
    getStats() {
        const stats = {
            queueSize: this.retryQueue.size,
            activeRetries: this.activeRetries.size,
            queuedItems: [],
            activeItems: []
        };

        // Add queue details
        for (const [retryId, entry] of this.retryQueue.entries()) {
            stats.queuedItems.push({
                retryId,
                orderId: entry.orderId,
                platform: entry.platform,
                operation: entry.operation,
                retryCount: entry.retryCount,
                retryAt: entry.retryAt,
                status: entry.status
            });
        }

        // Add active retry details
        for (const [retryId, startTime] of this.activeRetries.entries()) {
            stats.activeItems.push({
                retryId,
                startTime,
                duration: Date.now() - startTime
            });
        }

        return stats;
    }

    /**
     * Manually retry a DLQ item
     */
    async retryDLQItem(dlqId) {
        try {
            const dlqItem = await DeadLetterQueueModel.findById(dlqId);
            if (!dlqItem) {
                throw new Error('DLQ item not found');
            }

            // Mark as retrying
            await dlqItem.markForRetry();

            // Schedule retry
            const result = await this.scheduleRetry(
                dlqItem.orderId,
                dlqItem.platform,
                dlqItem.operation,
                dlqItem.payload,
                0 // Reset retry count for manual retry
            );

            return result;
        } catch (error) {
            logger.error('Failed to retry DLQ item', {
                dlqId,
                error: error.message
            });
            throw error;
        }
    }
}

// Export singleton instance
export default new RetryService();