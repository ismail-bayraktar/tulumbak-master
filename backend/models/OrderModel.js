import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    items: {type: Array, required: true},
    amount: {type: Number, required: true},
    address: {type: Object, required: true},
    status: {type: String, required: true , default: 'Siparişiniz Alındı'},
    courierStatus: { type: String, default: 'hazırlanıyor' }, // hazırlanıyor | yolda | teslim edildi | iptal
    courierTrackingId: { type: String },
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
    phone: {type: String} // Customer phone for SMS notifications
});

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;