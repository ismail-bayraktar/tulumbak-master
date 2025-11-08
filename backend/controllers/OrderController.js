import orderModel from "../models/OrderModel.js";
import userModel from "../models/UserModel.js";
import deliveryZoneModel from "../models/DeliveryZoneModel.js";
import { reduceStock, checkLowStockAlert } from "../middleware/StockCheck.js";
import AssignmentService, { assignBranch, suggestBranch } from "../services/AssignmentService.js";
import settingsModel from "../models/SettingsModel.js";

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
        
        // Validate delivery zone if provided
        if (delivery?.zoneId) {
            const zone = await deliveryZoneModel.findById(delivery.zoneId);
            if (!zone) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Seçilen teslimat bölgesi geçersiz' 
                });
            }
            
            // Validate minimum order amount
            if (Number(amount) < zone.minOrder) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Bu bölgeye teslimat için minimum ${zone.minOrder}₺ tutarında sipariş gerekiyor. Sepetiniz toplamı: ${amount}₺` 
                });
            }
            
            // Validate same day delivery availability
            if (delivery.sameDay && !zone.sameDayAvailable) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Bu bölge için aynı gün teslimat mevcut değil' 
                });
            }
        }
        
        // Generate tracking ID
        const trackingId = generateTrackingId();
        const trackingLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/track/${trackingId}`;
        
        // Get branch assignment settings
        let assignmentMode = 'auto';
        let assignmentEnabled = true;
        try {
            const assignmentEnabledSetting = await settingsModel.findOne({ key: 'branch_assignment_enabled' });
            const assignmentModeSetting = await settingsModel.findOne({ key: 'branch_assignment_mode' });
            
            if (assignmentEnabledSetting) {
                assignmentEnabled = assignmentEnabledSetting.value !== false;
            }
            if (assignmentModeSetting && ['auto', 'hybrid', 'manual'].includes(assignmentModeSetting.value)) {
                assignmentMode = assignmentModeSetting.value;
            }
        } catch (error) {
            console.error('Error reading branch assignment settings:', error);
        }
        
        // Find best branch (suggestion or direct assignment)
        const bestBranch = assignmentEnabled ? await AssignmentService.findBestBranch({ delivery, address }) : null;

        // Build assignment object based on mode
        let assignmentObj = {};
        let branchAssignment = {};
        
        if (bestBranch && assignmentEnabled) {
            if (assignmentMode === 'auto') {
                branchAssignment = {
                    branchId: bestBranch._id.toString(),
                    branchCode: bestBranch.code
                };
                assignmentObj = {
                    mode: 'auto',
                    status: 'assigned',
                    decidedBy: 'system',
                    decidedAt: Date.now()
                };
            } else if (assignmentMode === 'hybrid') {
                assignmentObj = {
                    mode: 'hybrid',
                    status: 'suggested',
                    suggestedBranchId: bestBranch._id.toString(),
                    decidedBy: 'system'
                };
            } else if (assignmentMode === 'manual') {
                assignmentObj = {
                    mode: 'manual',
                    status: 'pending',
                    suggestedBranchId: bestBranch._id.toString(),
                    decidedBy: 'system'
                };
            }
        }

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
            ...branchAssignment,
            ...(Object.keys(assignmentObj).length > 0 ? { assignment: assignmentObj } : {}),
            statusHistory: [{
                status: 'Siparişiniz Alındı',
                timestamp: Date.now(),
                location: address?.address || '',
                note: bestBranch
                    ? (assignmentMode === 'auto'
                        ? `Siparişiniz ${bestBranch.name} şubesine atandı`
                        : `Önerilen şube: ${bestBranch.name}`)
                    : 'Siparişiniz sisteme kaydedildi',
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

// Get order status by ID
const getOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.json({ success: false, message: 'Order not found' });
        }

        res.json({
            success: true,
            status: order.status || order.courierStatus,
            lastUpdate: order.statusHistory?.[order.statusHistory.length - 1] || {},
            nextSteps: getNextSteps(order.status || order.courierStatus)
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get order history
const getOrderHistory = async (req, res) => {
    try {
        const { orderId } = req.params;
        
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.json({ success: false, message: 'Order not found' });
        }

        res.json({
            success: true,
            history: order.statusHistory || []
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get order timeline
const getOrderTimeline = async (req, res) => {
    try {
        const { orderId } = req.params;
        
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.json({ success: false, message: 'Order not found' });
        }

        const statusSteps = [
            { status: 'Siparişiniz Alındı', completed: false, current: false },
            { status: 'Siparişiniz Hazırlanıyor', completed: false, current: false },
            { status: 'Kuryeye Verildi', completed: false, current: false },
            { status: 'Siparişiniz Yola Çıktı', completed: false, current: false },
            { status: 'Teslim Edildi', completed: false, current: false }
        ];

        const history = order.statusHistory || [];
        const completedSteps = [];
        let currentStep = null;

        statusSteps.forEach((step, index) => {
            const found = history.find(h => h.status === step.status);
            if (found) {
                completedSteps.push(step);
                step.completed = true;
                
                // Find current step (last completed)
                if (!currentStep || (found.timestamp > (currentStep.timestamp || 0))) {
                    currentStep = { ...step, index, found };
                }
            }
        });

        // Set current step
        if (currentStep && statusSteps[currentStep.index + 1]) {
            statusSteps[currentStep.index + 1].current = true;
        }

        res.json({
            success: true,
            completedSteps: completedSteps.length,
            currentStep: currentStep ? currentStep.status : statusSteps[0].status,
            upcomingSteps: statusSteps.filter(s => !s.completed && !s.current),
            timeline: statusSteps
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Helper function for next steps
const getNextSteps = (status) => {
    const steps = {
        'Siparişiniz Alındı': ['Siparişiniz Hazırlanıyor', 'Siparişiniz Kuryeye Verilecek'],
        'Siparişiniz Hazırlanıyor': ['Kuryeye Verildi', 'Teslim İçin Hazır'],
        'Kuryeye Verildi': ['Yola Çıkacak', 'Teslim Edilecek'],
        'Siparişiniz Yola Çıktı': ['Teslim Edilecek', 'Müşteriye Ulaşacak'],
        'Teslim Edildi': []
    };
    return steps[status] || [];
};

// Assign branch to order
const assignBranchToOrder = async (req, res) => {
    try {
        const { orderId, branchId } = req.body;
        
        if (!orderId || !branchId) {
            return res.json({ success: false, message: 'Order ID and Branch ID are required' });
        }
        
        const result = await assignBranch(orderId, branchId);
        
        if (result.success) {
            // Add status history
            await addStatusHistory(orderId, 'Şube Atandı', '', result.message, 'admin');
            res.json({ success: true, message: result.message, branch: result.branch });
        } else {
            res.json({ success: false, message: result.message });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get branch suggestion for order
const getBranchSuggestion = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await suggestBranch(id);
        
        if (result.success) {
            res.json({ success: true, branch: result.branch });
        } else {
            res.json({ success: false, message: result.message });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Prepare order (mark as preparing)
const prepareOrder = async (req, res) => {
    try {
        const { orderId } = req.body;
        
        if (!orderId) {
            return res.json({ success: false, message: 'Order ID is required' });
        }
        
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.json({ success: false, message: 'Order not found' });
        }
        
        // Validate: must have branch assigned
        if (!order.branchId) {
            return res.json({ success: false, message: 'Order must have a branch assigned before preparation' });
        }
        
        // Validate: status must be 'Siparişiniz Alındı' or 'Hazırlanıyor'
        if (order.status !== 'Siparişiniz Alındı' && order.status !== 'Hazırlanıyor') {
            return res.json({ success: false, message: `Cannot prepare order with status: ${order.status}` });
        }
        
        order.status = 'Hazırlanıyor';
        order.preparationStartedAt = order.preparationStartedAt || Date.now();
        
        await addStatusHistory(orderId, 'Hazırlanıyor', '', 'Sipariş hazırlanmaya başlandı', 'admin');
        await order.save();
        
        res.json({ success: true, message: 'Order marked as preparing', order });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Send order to courier
const sendToCourier = async (req, res) => {
    try {
        const { orderId } = req.body;
        
        if (!orderId) {
            return res.json({ success: false, message: 'Order ID is required' });
        }
        
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.json({ success: false, message: 'Order not found' });
        }
        
        // Validate: must have branch assigned
        if (!order.branchId) {
            return res.json({ success: false, message: 'Order must have a branch assigned before sending to courier' });
        }
        
        // Validate: status must be 'Hazırlanıyor'
        if (order.status !== 'Hazırlanıyor') {
            return res.json({ success: false, message: `Order must be in 'Hazırlanıyor' status. Current status: ${order.status}` });
        }
        
        // Update order status
        order.status = 'Kuryeye Verildi';
        order.courierStatus = 'yolda';
        order.sentToCourierAt = Date.now();
        
        // Generate courier tracking ID if not exists
        if (!order.courierTrackingId) {
            order.courierTrackingId = `CR-${Math.random().toString(36).slice(2,10).toUpperCase()}`;
        }
        
        // TODO: Send to EsnafExpress (placeholder)
        // const esnafExpressResult = await EsnafExpressService.sendOrder(order);
        // if (esnafExpressResult.success) {
        //     order.esnafExpressOrderId = esnafExpressResult.orderId;
        // }
        
        await addStatusHistory(orderId, 'Kuryeye Verildi', '', 'Sipariş kuryeye teslim edildi', 'admin');
        await order.save();
        
        res.json({ 
            success: true, 
            message: 'Order sent to courier', 
            order,
            courierTrackingId: order.courierTrackingId
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Approve suggested branch assignment (hybrid mode)
const approveBranchAssignment = async (req, res) => {
    try {
        const { orderId } = req.body;
        const order = await orderModel.findById(orderId);
        if (!order) return res.json({ success: false, message: 'Order not found' });

        if (order.assignment?.mode !== 'hybrid' || order.assignment?.status !== 'suggested') {
            return res.json({ success: false, message: 'This order has no pending suggestion' });
        }

        const branchId = order.assignment.suggestedBranchId;
        if (!branchId) return res.json({ success: false, message: 'Suggested branch not found' });

        order.branchId = branchId;
        order.branchCode = order.branchCode || undefined; // keep if set later
        order.assignment.status = 'assigned';
        order.assignment.decidedBy = 'admin';
        order.assignment.decidedAt = Date.now();

        await order.save();
        await addStatusHistory(orderId, order.status || 'Siparişiniz Alındı', order.address?.address || '', 'Önerilen şube onaylandı', 'admin');

        res.json({ success: true, message: 'Branch assignment approved', order });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export {
    placeOrder, 
    placeOrderStripe, 
    placeOrderRazorpay, 
    allOrders, 
    userOrders, 
    updateStatus, 
    bankInfo, 
    getOrderStatus, 
    getOrderHistory, 
    getOrderTimeline, 
    approveBranchAssignment,
    assignBranchToOrder,
    getBranchSuggestion,
    prepareOrder,
    sendToCourier
};