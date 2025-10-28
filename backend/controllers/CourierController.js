import orderModel from "../models/OrderModel.js";

// Mock: Kurye oluşturma isteği (ERP/kurye servisine gidecek payload)
const requestCourierPickup = async (req, res) => {
    try {
        const { orderId } = req.body;
        const courierTrackingId = `CR-${Math.random().toString(36).slice(2,10).toUpperCase()}`;
        await orderModel.findByIdAndUpdate(orderId, { courierTrackingId, courierStatus: 'yolda' });
        res.json({ success: true, courierTrackingId });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Mock: Kurye sisteminden webhook (imza doğrulama ileride eklenecek)
const courierWebhook = async (req, res) => {
    try {
        const { courierTrackingId, status } = req.body;
        const order = await orderModel.findOne({ courierTrackingId });
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        await orderModel.findByIdAndUpdate(order._id, { courierStatus: status });
        res.json({ success: true });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { requestCourierPickup, courierWebhook };


