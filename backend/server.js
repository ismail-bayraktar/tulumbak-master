import express from 'express';
import cors from 'cors';
import "dotenv/config"
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import path, {dirname} from "path";
import userRouter from "./routes/UserRoute.js";
import productRouter from "./routes/ProductRoute.js";
import cartRouter from "./routes/CartRoute.js";
import orderRouter from "./routes/OrderRoute.js";
import ejsLayouts from 'express-ejs-layouts';
import { fileURLToPath } from 'url';
import paytrRouter from "./routes/PayTrRoute.js";
import sliderRouter from "./routes/SliderRoute.js";
import deliveryRouter from "./routes/DeliveryRoute.js";
import courierRouter from "./routes/CourierRoute.js";
import couponRouter from "./routes/CouponRoute.js";
import corporateRouter from "./routes/CorporateRoute.js";

// APP CONFIG
const app = express();
const port = process.env.PORT || 4001;
connectDB();
connectCloudinary();

// PAYTR
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const viewsPath = path.join(__dirname, '/app_server/views');
console.log("viewsPath", viewsPath);

app.set('views', path.join(__dirname, '/app_server/views'));
app.use(express.urlencoded({ extended: true }));
app.set('views', viewsPath);
app.set('view engine', 'ejs');
app.use(ejsLayouts);


// MIDDLEWARES
app.use(express.json());
app.use(cors());

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API ENDPOINTS
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/paytr', paytrRouter);
app.use('/api/slider', sliderRouter);
app.use('/api/courier', courierRouter);
app.use('/api/delivery', deliveryRouter);
app.use('/api/coupon', couponRouter);
app.use('/api/corporate', corporateRouter);
app.get('/paytr/payment', (req, res) => {
    const token = req.query.token;
    res.render('layout', { iframetoken: token });
});
app.get('/', (req, res) => {
    res.send("API Working")
})

app.listen(port, () => {
    console.log("Server running on PORT: " + port);
})
