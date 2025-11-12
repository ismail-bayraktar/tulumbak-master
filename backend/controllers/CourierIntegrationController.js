import CourierIntegrationConfigModel from '../models/CourierIntegrationConfigModel.js';
import CourierIntegrationService from '../services/CourierIntegrationService.js';
import CircuitBreakerService from '../services/CircuitBreakerService.js';
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