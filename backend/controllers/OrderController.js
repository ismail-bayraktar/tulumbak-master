import orderModel from "../models/OrderModel.js";
import userModel from "../models/UserModel.js";

// placing orders using cod method
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address, paymentMethod, delivery, codFee, giftNote } = req.body;
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
        }
        const newOrder = new orderModel(orderData);
        await newOrder.save();
        await userModel.findByIdAndUpdate(userId, {cartData: {}});
        res.json({success: true, message: "Order successfully placed"});
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
        await orderModel.findByIdAndUpdate(orderId, {status});
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