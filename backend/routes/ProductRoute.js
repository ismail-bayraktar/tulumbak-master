import express from 'express';
import {listProducts, addProduct, removeProduct, singleProduct, updateProduct} from '../controllers/ProductController.js';
import adminAuth from "../middleware/AdminAuth.js";
import uploadImagesWithMulter from "../config/uploadImagesWithMulter.js";

const productRouter = express.Router();

const imageUploadMiddleware = uploadImagesWithMulter.fields([
    {name: 'image1', maxCount: 1},
    {name: 'image2', maxCount: 1},
    {name: 'image3', maxCount: 1},
    {name: 'image4', maxCount: 1}
]);

productRouter.post('/add', adminAuth, imageUploadMiddleware, addProduct);
productRouter.post('/update', adminAuth, imageUploadMiddleware, updateProduct);
productRouter.post('/remove', adminAuth, removeProduct);
productRouter.post('/single', singleProduct);
productRouter.get('/list', listProducts);

export default productRouter;
