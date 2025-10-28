import express from 'express';
import { requestCourierPickup, courierWebhook } from "../controllers/CourierController.js";

const courierRouter = express.Router();

// Admin veya sistem içinden kurye çağırma
courierRouter.post('/request-pickup', requestCourierPickup);

// Kurye sisteminden durum güncellemesi (webhook)
courierRouter.post('/webhook', courierWebhook);

export default courierRouter;


