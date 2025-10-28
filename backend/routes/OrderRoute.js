import express from 'express';
import {placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus, bankInfo} from '../controllers/OrderController.js';
import adminAuth from "../middleware/AdminAuth.js";
import authUser from "../middleware/Auth.js";
import {updatePayTrOrderItemsAndAddress} from "../controllers/PayTrController.js";

const orderRouter = express.Router();

// admin features
orderRouter.post("/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateStatus);

// payment features
orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/stripe", authUser, placeOrderStripe);
orderRouter.post("/razorpay", authUser, placeOrderRazorpay);

// user feature
orderRouter.post("/userorders", authUser, userOrders);
orderRouter.put("/update-paytr-order", authUser, updatePayTrOrderItemsAndAddress);
orderRouter.get("/bank-info", bankInfo);

export default orderRouter;