import couponModel from "../models/CouponModel.js";

// Validate coupon code
const validateCoupon = async (req, res) => {
    try {
        const { code, cartTotal } = req.body;
        const coupon = await couponModel.findOne({ code: code.toUpperCase(), active: true });
        if (!coupon) return res.json({ success: false, message: 'Geçersiz kupon' });
        const now = Date.now();
        if (now < coupon.validFrom || now > coupon.validUntil) return res.json({ success: false, message: 'Kupon süresi dolmuş' });
        if (Number(cartTotal) < coupon.minCart) return res.json({ success: false, message: `Minimum ${coupon.minCart} TL sipariş tutarı gerekli` });
        if (coupon.usageLimit > 0 && coupon.usageCount >= coupon.usageLimit) return res.json({ success: false, message: 'Kupon kullanım limiti dolmuş' });
        let discount = 0;
        if (coupon.type === 'yüzde') discount = (cartTotal * coupon.value) / 100;
        else discount = coupon.value;
        res.json({ success: true, discount, coupon });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// CRUD
const createCoupon = async (req, res) => {
    try {
        const coupon = new couponModel(req.body);
        await coupon.save();
        res.json({ success: true, coupon });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const listCoupons = async (_req, res) => {
    try {
        const coupons = await couponModel.find({});
        res.json({ success: true, coupons });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const updateCoupon = async (req, res) => {
    try {
        const { id, ...payload } = req.body;
        await couponModel.findByIdAndUpdate(id, payload);
        res.json({ success: true });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const removeCoupon = async (req, res) => {
    try {
        const { id } = req.body;
        await couponModel.findByIdAndDelete(id);
        res.json({ success: true });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { validateCoupon, createCoupon, listCoupons, updateCoupon, removeCoupon };

