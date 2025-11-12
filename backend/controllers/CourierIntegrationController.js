import CourierIntegrationConfigModel from '../models/CourierIntegrationConfigModel.js';
import CourierIntegrationService from '../services/CourierIntegrationService.js';
import CircuitBreakerService from '../services/CircuitBreakerService.js';
import RetryService from '../services/RetryService.js';
import MuditaKuryeService from '../services/MuditaKuryeService.js';
import WebhookEventModel from '../models/WebhookEventModel.js';
import DeadLetterQueueModel from '../models/DeadLetterQueueModel.js';
import orderModel from '../models/OrderModel.js';
import logger from '../utils/logger.js';

/**
 * Get all courier integration configurations
 * GET /api/courier-integration/configs
 */
export const getConfigurations = async (req, res) => {
    try {
        const configs = await CourierIntegrationConfigModel.find({});

        // Decrypt sensitive data for display (but mask it)
        const safeConfigs = configs.map(config => {
            const safeConfig = config.toObject();

            // Mask sensitive fields
            if (safeConfig.apiKey) {
                safeConfig.apiKey = safeConfig.apiKey.substr(0, 10) + '...';
            }
            if (safeConfig.apiSecret) {
                safeConfig.apiSecret = '***masked***';
            }
            if (safeConfig.webhookSecret) {
                safeConfig.webhookSecret = '***masked***';
            }

            return safeConfig;
        });

        res.json({
            success: true,
            configs: safeConfigs
        });
    } catch (error) {
        logger.error('Failed to get courier configurations', {
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({
            success: false,
            message: 'Failed to get configurations'
        });
    }
};

/**
 * Get specific courier configuration
 * GET /api/courier-integration/configs/:platform
 */
export const getConfiguration = async (req, res) => {
    try {
        const { platform } = req.params;

        const config = await CourierIntegrationConfigModel.findOne({ platform });

        if (!config) {
            return res.status(404).json({
                success: false,
                message: 'Configuration not found'
            });
        }

        const safeConfig = config.toObject();

        // Mask sensitive fields
        if (safeConfig.apiKey) {
            safeConfig.apiKey = safeConfig.apiKey.substr(0, 10) + '...';
        }
        if (safeConfig.apiSecret) {
            safeConfig.apiSecret = '***masked***';
        }
        if (safeConfig.webhookSecret) {
            safeConfig.webhookSecret = '***masked***';
        }

        res.json({
            success: true,
            config: safeConfig
        });
    } catch (error) {
        logger.error('Failed to get courier configuration', {
            platform: req.params.platform,
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({
            success: false,
            message: 'Failed to get configuration'
        });
    }
};

/**
 * Update courier configuration
 * PUT /api/courier-integration/configs/:platform
 */
export const updateConfiguration = async (req, res) => {
    try {
        const { platform } = req.params;
        const updates = req.body;

        // Find existing config
        const config = await CourierIntegrationConfigModel.findOne({ platform });

        if (!config) {
            return res.status(404).json({
                success: false,
                message: 'Configuration not found'
            });
        }

        // Update only allowed fields
        const allowedFields = [
            'enabled',
            'testMode',
            'apiUrl',
            'restaurantId',
            'retryConfig',
            'circuitBreaker',
            'statusMapping',
            'metadata'
        ];

        // Update sensitive fields only if provided
        const sensitiveFields = ['apiKey', 'apiSecret', 'webhookSecret'];

        for (const field of allowedFields) {
            if (updates[field] !== undefined) {
                config[field] = updates[field];
            }
        }

        // Handle sensitive fields (encrypt if provided)
        for (const field of sensitiveFields) {
            if (updates[field] && !updates[field].includes('***')) {
                // Only update if not masked value
                config[field] = config.constructor.encryptField(updates[field]);
            }
        }

        config.updatedAt = Date.now();
        await config.save();

        // Reset circuit breaker if config changed
        if (updates.circuitBreaker) {
            CircuitBreakerService.reset(platform);
        }

        logger.info('Courier configuration updated', {
            platform,
            updatedFields: Object.keys(updates)
        });

        res.json({
            success: true,
            message: 'Configuration updated successfully',
            config: {
                ...config.toObject(),
                apiKey: '***masked***',
                apiSecret: '***masked***',
                webhookSecret: '***masked***'
            }
        });
    } catch (error) {
        logger.error('Failed to update courier configuration', {
            platform: req.params.platform,
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({
            success: false,
            message: 'Failed to update configuration'
        });
    }
};

/**
 * Test courier connection
 * POST /api/courier-integration/test/:platform
 */
export const testConnection = async (req, res) => {
    try {
        const { platform } = req.params;

        // Initialize service if not already done
        await CourierIntegrationService.initialize();

        const result = await CourierIntegrationService.testConnection(platform);

        if (result.success) {
            logger.info('Courier connection test successful', {
                platform,
                testMode: result.testMode
            });

            res.json({
                success: true,
                message: 'Connection test successful',
                details: result
            });
        } else {
            logger.warn('Courier connection test failed', {
                platform,
                error: result.error
            });

            res.status(400).json({
                success: false,
                message: 'Connection test failed',
                error: result.error
            });
        }
    } catch (error) {
        logger.error('Failed to test courier connection', {
            platform: req.params.platform,
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({
            success: false,
            message: 'Failed to test connection',
            error: error.message
        });
    }
};

/**
 * Get integration statistics
 * GET /api/courier-integration/stats
 */
export const getStatistics = async (req, res) => {
    try {
        await CourierIntegrationService.initialize();
        const stats = await CourierIntegrationService.getStatistics();

        res.json({
            success: true,
            statistics: stats
        });
    } catch (error) {
        logger.error('Failed to get integration statistics', {
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({
            success: false,
            message: 'Failed to get statistics'
        });
    }
};

/**
 * Get circuit breaker status
 * GET /api/courier-integration/circuit-breakers
 */
export const getCircuitBreakerStatus = async (req, res) => {
    try {
        const status = CircuitBreakerService.getAllStatus();

        res.json({
            success: true,
            circuitBreakers: status
        });
    } catch (error) {
        logger.error('Failed to get circuit breaker status', {
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({
            success: false,
            message: 'Failed to get circuit breaker status'
        });
    }
};

/**
 * Reset circuit breaker for a platform
 * POST /api/courier-integration/circuit-breakers/:platform/reset
 */
export const resetCircuitBreaker = async (req, res) => {
    try {
        const { platform } = req.params;

        CircuitBreakerService.reset(platform);

        logger.info('Circuit breaker reset', { platform });

        res.json({
            success: true,
            message: `Circuit breaker reset for ${platform}`,
            status: CircuitBreakerService.getStatus(platform)
        });
    } catch (error) {
        logger.error('Failed to reset circuit breaker', {
            platform: req.params.platform,
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({
            success: false,
            message: 'Failed to reset circuit breaker'
        });
    }
};

/**
 * Submit order to courier manually
 * POST /api/courier-integration/submit-order
 */
export const submitOrder = async (req, res) => {
    try {
        const { orderId, platform } = req.body;

        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: 'Order ID is required'
            });
        }

        await CourierIntegrationService.initialize();
        const result = await CourierIntegrationService.submitOrder(orderId, platform);

        if (result.success) {
            logger.info('Order manually submitted to courier', {
                orderId,
                platform: result.platform,
                externalOrderId: result.externalOrderId
            });

            res.json({
                success: true,
                message: 'Order submitted successfully',
                result
            });
        } else {
            logger.warn('Failed to submit order to courier', {
                orderId,
                platform,
                error: result.error
            });

            res.status(400).json({
                success: false,
                message: 'Failed to submit order',
                error: result.error
            });
        }
    } catch (error) {
        logger.error('Failed to submit order to courier', {
            orderId: req.body.orderId,
            platform: req.body.platform,
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({
            success: false,
            message: 'Failed to submit order',
            error: error.message
        });
    }
};

/**
 * Cancel order with courier
 * POST /api/courier-integration/cancel-order
 */
export const cancelOrder = async (req, res) => {
    try {
        const { orderId, reason } = req.body;

        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: 'Order ID is required'
            });
        }

        await CourierIntegrationService.initialize();
        const result = await CourierIntegrationService.cancelOrder(orderId, reason);

        if (result.success) {
            logger.info('Order cancelled with courier', {
                orderId,
                reason
            });

            res.json({
                success: true,
                message: 'Order cancelled successfully',
                result
            });
        } else {
            logger.warn('Failed to cancel order with courier', {
                orderId,
                error: result.error
            });

            res.status(400).json({
                success: false,
                message: 'Failed to cancel order',
                error: result.error
            });
        }
    } catch (error) {
        logger.error('Failed to cancel order with courier', {
            orderId: req.body.orderId,
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({
            success: false,
            message: 'Failed to cancel order',
            error: error.message
        });
    }
};

/**
 * Get order tracking
 * GET /api/courier-integration/tracking/:orderId
 */
export const getOrderTracking = async (req, res) => {
    try {
        const { orderId } = req.params;

        await CourierIntegrationService.initialize();
        const tracking = await CourierIntegrationService.getOrderTracking(orderId);

        res.json({
            success: true,
            tracking: tracking.tracking
        });
    } catch (error) {
        logger.error('Failed to get order tracking', {
            orderId: req.params.orderId,
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({
            success: false,
            message: 'Failed to get tracking information',
            error: error.message
        });
    }
};

/**
 * Get integration dashboard overview
 * GET /api/courier-integration/dashboard
 */
export const getDashboard = async (req, res) => {
    try {
        const { platform = 'muditakurye' } = req.query;

        // Get config
        const config = await CourierIntegrationConfigModel.findOne({ platform });
        if (!config) {
            return res.status(404).json({
                success: false,
                message: 'Configuration not found'
            });
        }

        // Get circuit breaker status
        const circuitBreaker = CircuitBreakerService.getStatus(platform);

        // Get retry queue stats
        const retryStats = await RetryService.getStats();

        // Get recent orders with courier integration
        const recentOrders = await orderModel.find({
            'courierIntegration.platform': platform
        })
        .sort({ createdAt: -1 })
        .limit(10)
        .select('_id orderNumber courierIntegration.syncStatus courierIntegration.externalOrderId createdAt')
        .lean();

        // Get DLQ count
        const dlqCount = await DeadLetterQueueModel.countDocuments({
            platform,
            status: 'pending'
        });

        // Get webhook stats (last 7 days)
        const webhookStats = await WebhookEventModel.aggregate([
            {
                $match: {
                    'metadata.platform': platform,
                    createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
                }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Calculate success rates
        const totalOrders = recentOrders.length;
        const syncedOrders = recentOrders.filter(o => o.courierIntegration?.syncStatus === 'synced').length;
        const successRate = totalOrders > 0 ? ((syncedOrders / totalOrders) * 100).toFixed(2) : 0;

        res.json({
            success: true,
            data: {
                platform,
                config: {
                    enabled: config.enabled,
                    testMode: config.testMode,
                    apiUrl: config.apiUrl,
                    webhookOnlyMode: config.webhookOnlyMode
                },
                status: {
                    circuitBreaker: circuitBreaker || { state: 'CLOSED', platform },
                    retryQueue: {
                        size: retryStats.queueSize,
                        activeRetries: retryStats.activeRetries
                    },
                    dlqPending: dlqCount
                },
                metrics: {
                    totalOrders,
                    syncedOrders,
                    successRate: parseFloat(successRate),
                    webhookStats: webhookStats.reduce((acc, stat) => {
                        acc[stat._id] = stat.count;
                        return acc;
                    }, {})
                },
                recentOrders: recentOrders.map(o => ({
                    id: o._id,
                    orderNumber: o.orderNumber,
                    status: o.courierIntegration?.syncStatus,
                    externalId: o.courierIntegration?.externalOrderId,
                    createdAt: o.createdAt
                }))
            }
        });

    } catch (error) {
        logger.error('Failed to get integration dashboard', {
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({
            success: false,
            message: 'Failed to get dashboard data',
            error: error.message
        });
    }
};

/**
 * Validate configuration
 * POST /api/courier-integration/validate/:platform
 */
export const validateConfiguration = async (req, res) => {
    try {
        const { platform } = req.params;

        const config = await CourierIntegrationConfigModel.findOne({ platform });
        if (!config) {
            return res.status(404).json({
                success: false,
                message: 'Configuration not found'
            });
        }

        const validation = {
            valid: true,
            errors: [],
            warnings: []
        };

        // Check required fields
        if (!config.apiKey || config.apiKey.length < 10) {
            validation.valid = false;
            validation.errors.push('API Key is missing or invalid');
        }

        if (!config.restaurantId) {
            validation.valid = false;
            validation.errors.push('Restaurant ID is required');
        }

        if (!config.webhookSecret) {
            validation.warnings.push('Webhook secret is not configured');
        }

        if (!config.apiUrl) {
            validation.errors.push('API URL is required');
        }

        // Check test mode
        if (config.testMode) {
            validation.warnings.push('Running in TEST MODE');
        }

        // Check circuit breaker
        if (!config.circuitBreaker?.enabled) {
            validation.warnings.push('Circuit breaker is disabled');
        }

        // Check retry config
        if (!config.retryConfig?.maxRetries) {
            validation.warnings.push('Retry configuration not set');
        }

        res.json({
            success: true,
            validation
        });

    } catch (error) {
        logger.error('Failed to validate configuration', {
            platform: req.params.platform,
            error: error.message
        });
        res.status(500).json({
            success: false,
            message: 'Failed to validate configuration',
            error: error.message
        });
    }
};

/**
 * Send test order
 * POST /api/courier-integration/test-order/:platform
 */
export const sendTestOrder = async (req, res) => {
    try {
        const { platform } = req.params;

        // Initialize service
        await CourierIntegrationService.initialize();

        // Get config
        const config = await CourierIntegrationConfigModel.findOne({ platform });
        if (!config) {
            return res.status(404).json({
                success: false,
                message: 'Configuration not found'
            });
        }

        if (!config.testMode) {
            return res.status(400).json({
                success: false,
                message: 'Test orders can only be sent in TEST MODE. Enable test mode first.'
            });
        }

        // Create a test order object
        const testOrder = {
            _id: `test_${Date.now()}`,
            orderNumber: `TEST-${Date.now()}`,
            address: {
                name: 'Test Müşteri',
                phone: '+905551234567',
                email: 'test@example.com',
                address: 'Test Cad. No:1, Çankaya, Ankara',
                latitude: 39.9208,
                longitude: 32.8541
            },
            paymentMethod: 'Cash On Delivery',
            payment: false,
            amount: 150.00,
            delivery: {
                fee: 15.00
            },
            codFee: 5.00,
            items: [
                {
                    productId: 'TEST_PROD_001',
                    name: 'Test Pizza',
                    quantity: 2,
                    price: 50.00
                },
                {
                    productId: 'TEST_PROD_002',
                    name: 'Test İçecek',
                    quantity: 1,
                    price: 30.00
                }
            ],
            giftNote: 'Test siparişi - Admin panelinden gönderildi',
            createdAt: new Date(),
            courierIntegration: {}
        };

        // Get the service
        const service = platform === 'muditakurye' ? MuditaKuryeService : null;
        if (!service) {
            return res.status(400).json({
                success: false,
                message: `Service not found for platform: ${platform}`
            });
        }

        // Initialize service if needed
        if (service.initialize) {
            await service.initialize();
        }

        logger.info('Sending test order', {
            platform,
            testMode: config.testMode,
            orderId: testOrder._id
        });

        // Send order
        const result = await service.createOrder(testOrder);

        if (result.success) {
            res.json({
                success: true,
                message: 'Test order sent successfully',
                data: {
                    testOrderId: testOrder._id,
                    externalOrderId: result.externalOrderId,
                    response: result.response,
                    note: 'This is a TEST order. It will not create a real delivery.'
                }
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Failed to send test order',
                error: result.error,
                details: result.response
            });
        }

    } catch (error) {
        logger.error('Failed to send test order', {
            platform: req.params.platform,
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({
            success: false,
            message: 'Failed to send test order',
            error: error.message
        });
    }
};

/**
 * Simulate incoming webhook
 * POST /api/courier-integration/test-webhook/:platform
 */
export const testIncomingWebhook = async (req, res) => {
    try {
        const { platform } = req.params;
        const { eventType = 'order.status_changed', orderId, status = 'PREPARED' } = req.body;

        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: 'orderId is required'
            });
        }

        // Create test webhook payload
        const webhookPayload = {
            event: eventType,
            orderId: orderId,
            status: status,
            timestamp: new Date().toISOString(),
            test: true,
            platform: platform
        };

        logger.info('Simulating incoming webhook', {
            platform,
            payload: webhookPayload
        });

        // Find the order
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Update order status based on webhook
        order.courierIntegration = order.courierIntegration || {};
        order.courierIntegration.lastWebhookAt = new Date();
        order.courierIntegration.lastStatus = status;

        await order.save();

        res.json({
            success: true,
            message: 'Webhook simulation successful',
            data: {
                payload: webhookPayload,
                orderUpdated: true,
                note: 'This was a simulated webhook event'
            }
        });

    } catch (error) {
        logger.error('Failed to simulate webhook', {
            platform: req.params.platform,
            error: error.message
        });
        res.status(500).json({
            success: false,
            message: 'Failed to simulate webhook',
            error: error.message
        });
    }
};

/**
 * Get integration health
 * GET /api/courier-integration/health/:platform
 */
export const getIntegrationHealth = async (req, res) => {
    try {
        const { platform } = req.params;

        const health = {
            platform,
            status: 'healthy',
            checks: [],
            timestamp: new Date().toISOString()
        };

        // Check 1: Configuration exists
        const config = await CourierIntegrationConfigModel.findOne({ platform });
        health.checks.push({
            name: 'Configuration',
            status: config ? 'pass' : 'fail',
            message: config ? 'Configuration found' : 'Configuration not found'
        });

        if (!config) {
            health.status = 'unhealthy';
            return res.status(503).json({ success: false, health });
        }

        // Check 2: Circuit breaker state
        const circuitBreaker = CircuitBreakerService.getStatus(platform);
        health.checks.push({
            name: 'Circuit Breaker',
            status: circuitBreaker?.state === 'CLOSED' ? 'pass' : 'warn',
            message: `State: ${circuitBreaker?.state || 'UNKNOWN'}`,
            details: circuitBreaker
        });

        if (circuitBreaker?.state === 'OPEN') {
            health.status = 'degraded';
        }

        // Check 3: API Connection (only if not webhook-only)
        if (!config.webhookOnlyMode) {
            try {
                await CourierIntegrationService.initialize();
                const testResult = await CourierIntegrationService.testConnection(platform);

                health.checks.push({
                    name: 'API Connection',
                    status: testResult.success ? 'pass' : 'fail',
                    message: testResult.success ? 'API reachable' : 'API not reachable',
                    details: testResult
                });

                if (!testResult.success) {
                    health.status = 'unhealthy';
                }
            } catch (error) {
                health.checks.push({
                    name: 'API Connection',
                    status: 'fail',
                    message: error.message
                });
                health.status = 'unhealthy';
            }
        }

        // Check 4: Recent failures
        const recentFailures = await DeadLetterQueueModel.countDocuments({
            platform,
            status: 'pending',
            createdAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) } // Last hour
        });

        health.checks.push({
            name: 'Recent Failures',
            status: recentFailures > 10 ? 'warn' : 'pass',
            message: `${recentFailures} failures in last hour`,
            count: recentFailures
        });

        if (recentFailures > 10) {
            health.status = 'degraded';
        }

        const statusCode = health.status === 'healthy' ? 200 :
                          health.status === 'degraded' ? 200 : 503;

        res.status(statusCode).json({
            success: health.status !== 'unhealthy',
            health
        });

    } catch (error) {
        logger.error('Failed to check integration health', {
            platform: req.params.platform,
            error: error.message
        });
        res.status(500).json({
            success: false,
            message: 'Health check failed',
            error: error.message
        });
    }
};