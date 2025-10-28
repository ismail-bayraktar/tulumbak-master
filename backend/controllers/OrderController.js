import orderModel from "../models/OrderModel.js";
import userModel from "../models/UserModel.js";
import { reduceStock, checkLowStockAlert } from "../middleware/StockCheck.js";

// Generate unique tracking ID
const generateTrackingId = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let trackingId = '';
    for (let i = 0; i < 8; i++) {
        trackingId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return trackingId;
};

// Add status to order history
const addStatusHistory = async (orderId, status, location = '', note = '', updatedBy = 'system') => {
    try {
        const order = await orderModel.findById(orderId);
        if (!order) return;

        const historyEntry = {
            status,
            timestamp: Date.now(),
            location,
            note,
            updatedBy
        };

        if (!order.statusHistory) {
            order.statusHistory = [historyEntry];
        } else {
            order.statusHistory.push(historyEntry);
        }

        await order.save();
    } catch (error) {
        console.error('Error adding status history:', error);
    }
};

// placing orders using cod method
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address, paymentMethod, delivery, codFee, giftNote } = req.body;
        
        // Generate tracking ID
        const trackingId = generateTrackingId();
        const trackingLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/track/${trackingId}`;
        
        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: paymentMethod || "KAPIDA",
            payment: false,
            date: Date.now(),
            delivery: delivery || {},
            codFee: Number(codFee || 0),
            giftNote,
            trackingId,
            trackingLink,
            statusHistory: [{
                status: 'Siparişiniz Alındı',
                timestamp: Date.now(),
                location: address?.address || '',
                note: 'Siparişiniz sisteme kaydedildi',
                updatedBy: 'system'
            }]
        }
        
        const newOrder = new orderModel(orderData);
        
        // Reduce stock for all items
        await reduceStock(items);
        
        await newOrder.save();
        await userModel.findByIdAndUpdate(userId, {cartData: {}});
        
        // Check for low stock alerts
        for (const item of items) {
            await checkLowStockAlert(item.id);
        }
        
        // Get user data
        const user = await userModel.findById(userId);
        
        // Send notifications
        if (user) {
            // Email notification
            if (user.email) {
                const { default: emailService } = await import("../services/EmailService.js");
                await emailService.sendOrderConfirmation(
                    { ...orderData, orderId: newOrder._id.toString() },
                    user.email
                );
            }
            
            // SMS notification
            if (user.phone && process.env.SMS_ENABLED === 'true') {
                const { default: smsService } = await import("../services/SmsService.js");
                await smsService.sendOrderConfirmation(user.phone, { 
                    ...orderData, 
                    orderId: newOrder._id.toString(),
                    trackingLink
                });
            }
        }
        
        res.json({ success: true, order: newOrder, trackingId, trackingLink });
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message});
    }
}

// placing orders using stripe method
const placeOrderStripe = async (req, res) => {

}

// placing orders using cod method
const placeOrderRazorpay = async (req, res) => {

}

// all order data for admin panel
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({success: true, orders});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message});
    }
}

// user order data for frontend (my orders page)
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await orderModel.find({userId});
        res.json({success: true, orders});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message});
    }
}

// update order status from admin panel
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        
        // Get order before update
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.json({success: false, message: "Order not found"});
        }
        
        // Add to status history
        await addStatusHistory(orderId, status, order.address?.address || '', `Durum güncellendi: ${status}`, 'admin');
        
        await orderModel.findByIdAndUpdate(orderId, {status});
        
        // Get user data
        const user = await userModel.findById(order.userId);
        
        if (user) {
            // Email notifications
            if (user.email) {
                const { default: emailService } = await import("../services/EmailService.js");
                
                await emailService.sendOrderStatusUpdate(
                    { ...order.toObject(), orderId: order._id.toString() },
                    status,
                    user.email
                );
                
                // Send special emails based on status
                if (status === 'Hazırlanıyor') {
                    await emailService.sendCourierAssignment(
                        { ...order.toObject(), orderId: order._id.toString() },
                        user.email
                    );
                } else if (status === 'Teslim Edildi') {
                    await emailService.sendDeliveryCompleted(
                        { ...order.toObject(), orderId: order._id.toString() },
                        user.email
                    );
                }
            }
            
            // SMS notifications
            if (user.phone && process.env.SMS_ENABLED === 'true') {
                const { default: smsService } = await import("../services/SmsService.js");
                
                // Send SMS based on status
                if (status === 'Hazırlanıyor') {
                    await smsService.sendCourierAssigned(user.phone, {
                        ...order.toObject(),
                        orderId: order._id.toString()
                    });
                } else if (status === 'Teslim Edildi') {
                    await smsService.sendDeliveryCompleted(user.phone, order._id.toString());
                } else {
                    await smsService.sendOrderStatusUpdate(
                        user.phone,
                        status,
                        order._id.toString()
                    );
                }
            }
        }
        
        res.json({success: true, message: "Order status successfully updated"});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message});
    }
}

// Bank info (havale/EFT)
const bankInfo = async (_req, res) => {
    try {
        res.json({ success: true, bank: {
            iban: process.env.BANK_IBAN || 'TR00 0000 0000 0000 0000 0000 00',
            accountName: process.env.BANK_ACCOUNT_NAME || 'Tulumbak Gıda',
            bankName: process.env.BANK_NAME || 'Banka'
        }});
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export {placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus, bankInfo};