import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    items: {type: Array, required: true},
    amount: {type: Number, required: true},
    address: {type: Object, required: true},
    status: {type: String, required: true , default: 'Siparişiniz Alındı'},
    courierStatus: { type: String, default: 'hazırlanıyor' }, // hazırlanıyor | yolda | teslim edildi | iptal
    courierTrackingId: { type: String },
    statusHistory: [{
        status: { type: String, required: true },
        timestamp: { type: Number, default: Date.now },
        location: { type: String },
        note: { type: String },
        updatedBy: { type: String, enum: ['system', 'admin', 'courier'], default: 'system' }
    }],
    estimatedDelivery: { type: Number },
    actualDelivery: { type: Number },
    paymentMethod: {type: String, required: true},
    codFee: { type: Number, default: 0 },
    delivery: {
        zoneId: { type: String },
        timeSlotId: { type: String },
        sameDay: { type: Boolean, default: false }
    },
    payment: { type: Boolean, required: true , default: false },
    date: {type: Number, required:true},
    orderId: {type: String},
    phone: {type: String}, // Customer phone for SMS notifications
    trackingId: { type: String, unique: true }, // Public tracking ID (ABC123)
    trackingLink: { type: String }
});

// Performance indexes
orderSchema.index({ userId: 1, date: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ courierStatus: 1 });
orderSchema.index({ trackingId: 1 }, { unique: true, sparse: true });
orderSchema.index({ courierTrackingId: 1 });
orderSchema.index({ date: -1 });
orderSchema.index({ payment: 1 });
orderSchema.index({ 'delivery.zoneId': 1 });

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;