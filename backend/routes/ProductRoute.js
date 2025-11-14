import express from 'express';
import {
    listProducts,
    addProduct,
    removeProduct,
    singleProduct,
    updateProduct,
    softDeleteProduct,
    restoreProduct,
    permanentDeleteProduct,
    quickUpdateProduct,
    getProductBySKU,
    getProductByBarcode,
    getPriceRange
} from '../controllers/ProductController.js';
import adminAuth from "../middleware/AdminAuth.js";
import uploadImagesWithMulter from "../config/uploadImagesWithMulter.js";
import RateLimiterService from "../services/RateLimiter.js";
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
productRouter.post('/add', adminAuth, RateLimiterService.createUploadLimiter(), imageUploadMiddleware, invalidateCache('products:*'), addProduct);
productRouter.post('/update', adminAuth, RateLimiterService.createUploadLimiter(), imageUploadMiddleware, invalidateCache('products:*'), updateProduct);
productRouter.post('/remove', adminAuth, invalidateCache('products:*'), removeProduct);

// Soft delete and restore routes
productRouter.post('/soft-delete', adminAuth, invalidateCache('products:*'), softDeleteProduct);
productRouter.post('/restore', adminAuth, invalidateCache('products:*'), restoreProduct);
productRouter.post('/permanent-delete', adminAuth, invalidateCache('products:*'), permanentDeleteProduct);

// Quick update route for inline editing
productRouter.post('/quick-update', adminAuth, invalidateCache('products:*'), quickUpdateProduct);

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

/**
 * @swagger
 * /api/product/sku/{sku}:
 *   get:
 *     summary: Get product by SKU
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: sku
 *         required: true
 *         schema:
 *           type: string
 *         description: Product SKU (e.g., TUL-250-001)
 *     responses:
 *       200:
 *         description: Product details
 */
productRouter.get('/sku/:sku', cache(300), getProductBySKU);

/**
 * @swagger
 * /api/product/barcode/{barcode}:
 *   get:
 *     summary: Get product by barcode
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: barcode
 *         required: true
 *         schema:
 *           type: string
 *         description: Product barcode/GTIN
 *     responses:
 *       200:
 *         description: Product details
 */
productRouter.get('/barcode/:barcode', cache(300), getProductByBarcode);

/**
 * @swagger
 * /api/product/price-range:
 *   get:
 *     summary: Get min and max product prices for filter slider
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Price range
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 minPrice:
 *                   type: number
 *                 maxPrice:
 *                   type: number
 */
productRouter.get('/price-range', cache(300), getPriceRange);

export default productRouter;
