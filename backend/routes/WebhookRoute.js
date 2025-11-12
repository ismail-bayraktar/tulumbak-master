import express from 'express';
import { receiveWebhook, receiveMuditaKuryeWebhook } from '../controllers/WebhookController.js';
import RateLimiterService from '../services/RateLimiter.js';

const router = express.Router();

// Generic webhook receiver endpoint (public, no auth required)
// Rate limiting: 100 requests per minute per IP
router.post(
    '/courier',
    RateLimiterService.createGeneralLimiter(100, 60 * 1000), // 100 requests per minute
    receiveWebhook
);

// MuditaKurye-specific webhook endpoint
// This endpoint is specifically for MuditaKurye webhook callbacks
router.post(
    '/muditakurye',
    RateLimiterService.createGeneralLimiter(100, 60 * 1000), // 100 requests per minute
    receiveMuditaKuryeWebhook
);

// Third-party integration webhook endpoint (MuditaKurye format)
router.post(
    '/third-party/order',
    RateLimiterService.createGeneralLimiter(100, 60 * 1000), // 100 requests per minute
    receiveMuditaKuryeWebhook
);

export default router;

