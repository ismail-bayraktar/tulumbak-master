import express from 'express';
import { receiveWebhook } from '../controllers/WebhookController.js';
import RateLimiterService from '../services/RateLimiter.js';

const router = express.Router();

// Webhook receiver endpoint (public, no auth required)
// Rate limiting: 100 requests per minute per IP
router.post(
    '/courier',
    RateLimiterService.createGeneralLimiter(100, 60 * 1000), // 100 requests per minute
    receiveWebhook
);

export default router;

