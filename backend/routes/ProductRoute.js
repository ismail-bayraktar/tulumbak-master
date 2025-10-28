import express from 'express';
import {listProducts, addProduct, removeProduct, singleProduct, updateProduct} from '../controllers/ProductController.js';
import adminAuth from "../middleware/AdminAuth.js";
import uploadImagesWithMulter from "../config/uploadImagesWithMulter.js";
import RateLimiterService from "../services/RateLimiter.js";

const productRouter = express.Router();

const imageUploadMiddleware = uploadImagesWithMulter.fields([
    {name: 'image1', maxCount: 1},
    {name: 'image2', maxCount: 1},
    {name: 'image3', maxCount: 1},
    {name: 'image4', maxCount: 1}
]);

// Admin routes with rate limiting
productRouter.post('/add', adminAuth, RateLimiterService.createUploadLimiter(), imageUploadMiddleware, addProduct);
productRouter.post('/update', adminAuth, RateLimiterService.createUploadLimiter(), imageUploadMiddleware, updateProduct);
productRouter.post('/remove', adminAuth, removeProduct);

// Public routes
productRouter.post('/single', singleProduct);
productRouter.get('/list', listProducts);

export default productRouter;
