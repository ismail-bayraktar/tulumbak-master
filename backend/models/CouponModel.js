import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, uppercase: true },
    type: { type: String, enum: ['yüzde', 'tutar'], required: true },
    value: { type: Number, required: true },
    minCart: { type: Number, required: true, default: 0 },
    validFrom: { type: Number, required: true },
    validUntil: { type: Number, required: true },
    usageLimit: { type: Number, default: 0 },
    usageCount: { type: Number, default: 0 },
    active: { type: Boolean, default: true }
});

const couponModel = mongoose.models.coupon || mongoose.model("coupon", couponSchema);

export default couponModel;

