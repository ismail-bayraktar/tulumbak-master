import corporateOrderModel from "../models/CorporateOrderModel.js";

const createCorporateOrder = async (req, res) => {
    try {
        const orderData = { ...req.body, date: Date.now() };
        const order = new corporateOrderModel(orderData);
        await order.save();
        res.json({ success: true, order });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const listCorporateOrders = async (_req, res) => {
    try {
        const orders = await corporateOrderModel.find({}).sort({ date: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const updateCorporateOrderStatus = async (req, res) => {
    try {
        const { id, status, notes } = req.body;
        const updatePayload = { status };
        if (notes) updatePayload.notes = notes;
        await corporateOrderModel.findByIdAndUpdate(id, updatePayload);
        res.json({ success: true });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { createCorporateOrder, listCorporateOrders, updateCorporateOrderStatus };

