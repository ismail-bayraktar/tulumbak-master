import userModel from "../models/UserModel.js";
import logger from "../utils/logger.js";
import { validationResult } from "express-validator";

// add products to user cart
const addToCart = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        const userId = req.user.id;
        const { itemId, size } = req.body;
        const userData = await userModel.findById(userId);
        let cartData = await userData.cartData;

        if (cartData[itemId]) {
            if(cartData[itemId][size]){
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }

        await userModel.findByIdAndUpdate(userId, {cartData});
        res.json({success: true, message: "Added to cart!"});
    } catch (error) {
        logger.error('Error in cart controller', { error: error.message, stack: error.stack, endpoint: req.path, userId: req.body.userId, itemId: req.body.itemId });
        res.status(500).json({success: false, error: error.message});
    }
}

// update user cart
const updateCart = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        const userId = req.user.id;
        const { itemId, size, quantity } = req.body;
        const userData = await userModel.findById(userId);
        let cartData = await userData.cartData;

        if (cartData[itemId]) {
            cartData[itemId][size] = quantity;
        }

        await userModel.findByIdAndUpdate(userId, {cartData});
        res.json({success: true, message: "Cart updated!"});

    } catch (error) {
        logger.error('Error in cart controller', { error: error.message, stack: error.stack, endpoint: req.path, userId: req.body.userId, itemId: req.body.itemId });
        res.status(500).json({success: false, error: error.message});
    }
}

// get user cart data
const getUserCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const userData = await userModel.findById(userId);
        let cartData = await userData.cartData;

        res.json({success: true, cartData});
    } catch (error) {
        logger.error('Error in cart controller', { error: error.message, stack: error.stack, endpoint: req.path, userId: req.body.userId, itemId: req.body.itemId });
        res.status(500).json({success: false, error: error.message});
    }
}

export { addToCart, updateCart, getUserCart };