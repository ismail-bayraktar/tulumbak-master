import express from 'express';
import {listProducts, addProduct, removeProduct, singleProduct, updateProduct} from '../controllers/ProductController.js';
import adminAuth from "../middleware/AdminAuth.js";
import uploadImagesWithMulter from "../config/uploadImagesWithMulter.js";
import RateLimiterService from "../services/RateLimiter.js";
import { cache, invalidateCache } from "../middleware/cache.js";

const productRouter = express.Router();

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

// Public routes with caching
productRouter.post('/single', cache(300), singleProduct);
productRouter.get('/list', cache(300), listProducts);

export default productRouter;
