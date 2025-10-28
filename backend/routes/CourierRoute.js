import express from 'express';
import { requestCourierPickup, courierWebhook, getOrderTracking, updateCourierStatus } from "../controllers/CourierController.js";
import adminAuth from "../middleware/AdminAuth.js";

const courierRouter = express.Router();

// Public: Get order tracking (no auth required)
courierRouter.get('/track/:trackingId', getOrderTracking);

// Admin: Request courier pickup
courierRouter.post('/request-pickup', adminAuth, requestCourierPickup);

// Courier service: Status update webhook
courierRouter.post('/webhook', updateCourierStatus);

// Legacy support
courierRouter.post('/update-status', updateCourierStatus);

export default courierRouter;


