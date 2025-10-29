import express from 'express';
import {placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus, bankInfo, getOrderStatus, getOrderHistory, getOrderTimeline, approveBranchAssignment} from '../controllers/OrderController.js';
import adminAuth from "../middleware/AdminAuth.js";
import authUser from "../middleware/Auth.js";
import {updatePayTrOrderItemsAndAddress} from "../controllers/PayTrController.js";
import RateLimiterService from "../services/RateLimiter.js";
import { checkStockAvailability } from "../middleware/StockCheck.js";

const orderRouter = express.Router();

// admin features
orderRouter.post("/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateStatus);
orderRouter.post("/approve-branch", adminAuth, approveBranchAssignment);

// payment features with stock check and rate limiting
orderRouter.post("/place", authUser, checkStockAvailability, RateLimiterService.createOrderLimiter(), placeOrder);
orderRouter.post("/stripe", authUser, checkStockAvailability, RateLimiterService.createOrderLimiter(), placeOrderStripe);
orderRouter.post("/razorpay", authUser, checkStockAvailability, RateLimiterService.createOrderLimiter(), placeOrderRazorpay);

// user feature
orderRouter.post("/userorders", authUser, userOrders);
orderRouter.put("/update-paytr-order", authUser, updatePayTrOrderItemsAndAddress);
orderRouter.get("/bank-info", bankInfo);

// Order tracking endpoints (public, no auth required for tracking)
orderRouter.get("/:orderId/status", getOrderStatus);
orderRouter.get("/:orderId/history", getOrderHistory);
orderRouter.get("/:orderId/timeline", getOrderTimeline);

export default orderRouter;