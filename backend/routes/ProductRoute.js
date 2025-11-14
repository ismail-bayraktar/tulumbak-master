import express from 'express';
import {listProducts, addProduct, removeProduct, singleProduct, updateProduct} from '../controllers/ProductController.js';
import adminAuth from "../middleware/AdminAuth.js";
import uploadImagesWithMulter from "../config/uploadImagesWithMulter.js";
import RateLimiterService from "../services/RateLimiter.js";
import { body } from "express-validator";
import { cache, invalidateCache } from "../middleware/cache.js";

const productRouter = express.Router();

/**
 * @swagger
 * /api/product/list:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: inStockOnly
 *         schema:
 *           type: boolean
 *         description: Show only in-stock products
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 productData:
 *                   type: array
 */

const imageUploadMiddleware = uploadImagesWithMulter.fields([
    {name: 'image1', maxCount: 1},
    {name: 'image2', maxCount: 1},
    {name: 'image3', maxCount: 1},
    {name: 'image4', maxCount: 1}
]);

// Admin routes with rate limiting and cache invalidation
productRouter.post('/add',
    adminAuth,
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('description').notEmpty().withMessage('Description is required'),
        body('basePrice').isFloat({ gt: 0 }).withMessage('Base price must be a positive number'),
        body('category').notEmpty().withMessage('Category is required'),
        body('stock').isInt({ gt: -1 }).withMessage('Stock must be a non-negative integer'),
    ],
    RateLimiterService.createUploadLimiter(),
    imageUploadMiddleware,
    invalidateCache('products:*'),
    addProduct
);
productRouter.post('/update',
    adminAuth,
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('description').notEmpty().withMessage('Description is required'),
        body('basePrice').isFloat({ gt: 0 }).withMessage('Base price must be a positive number'),
        body('category').notEmpty().withMessage('Category is required'),
        body('stock').isInt({ gt: -1 }).withMessage('Stock must be a non-negative integer'),
    ],
    RateLimiterService.createUploadLimiter(),
    imageUploadMiddleware,
    invalidateCache('products:*'),
    updateProduct
);
productRouter.post('/remove', adminAuth, invalidateCache('products:*'), removeProduct);

/**
 * @swagger
 * /api/product/list:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *     responses:
 *       200:
 *         description: List of products
 */
productRouter.get('/list', cache(300), listProducts);

/**
 * @swagger
 * /api/product/single:
 *   post:
 *     summary: Get single product details
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product details
 */
productRouter.post('/single', cache(300), singleProduct);

export default productRouter;
