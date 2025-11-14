import express from 'express';
import { addToCart, getUserCart, updateCart } from "../controllers/CartController.js";
import authUser from "../middleware/Auth.js";
import { body } from "express-validator";

const cartRouter = express.Router();
cartRouter.post("/get", authUser, getUserCart);
cartRouter.post("/add",
    authUser,
    [
        body('itemId').notEmpty().withMessage('Item ID is required'),
        body('size').notEmpty().withMessage('Size is required'),
    ],
    addToCart
);
cartRouter.post("/update",
    authUser,
    [
        body('itemId').notEmpty().withMessage('Item ID is required'),
        body('size').notEmpty().withMessage('Size is required'),
        body('quantity').isInt({ gt: 0 }).withMessage('Quantity must be a positive integer'),
    ],
    updateCart
);

export default cartRouter;