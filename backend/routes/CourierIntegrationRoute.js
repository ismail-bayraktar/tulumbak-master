import express from 'express';
import adminAuth from '../middleware/adminAuth.js';
import {
    getConfigurations,
    getConfiguration,
    updateConfiguration,
    testConnection,
    getStatistics,
    getCircuitBreakerStatus,
    resetCircuitBreaker,
    submitOrder,
    cancelOrder,
    getOrderTracking
} from '../controllers/CourierIntegrationController.js';

const router = express.Router();

// Configuration management (admin only)
router.get('/configs', adminAuth, getConfigurations);
router.get('/configs/:platform', adminAuth, getConfiguration);
router.put('/configs/:platform', adminAuth, updateConfiguration);

// Connection testing (admin only)
router.post('/test/:platform', adminAuth, testConnection);

// Statistics and monitoring (admin only)
router.get('/stats', adminAuth, getStatistics);
router.get('/circuit-breakers', adminAuth, getCircuitBreakerStatus);
router.post('/circuit-breakers/:platform/reset', adminAuth, resetCircuitBreaker);

// Order operations (admin only)
router.post('/submit-order', adminAuth, submitOrder);
router.post('/cancel-order', adminAuth, cancelOrder);
router.get('/tracking/:orderId', adminAuth, getOrderTracking);

export default router;