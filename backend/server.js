import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import "dotenv/config"
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import { connectRedis } from "./config/redis.js";
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
import settingsRouter from "./routes/SettingsRoute.js";
import reportRouter from "./routes/ReportRoute.js";
import adminRouter from "./routes/AdminRoute.js";
import RateLimiterService from "./services/RateLimiter.js";
import logger, { logInfo } from "./utils/logger.js";
import { initSentry } from "./utils/sentry.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

// APP CONFIG
const app = express();
const port = process.env.PORT || 4001;

// Initialize Sentry (before other middleware)
initSentry();

// Create logs directory
import { existsSync, mkdirSync } from 'fs';
if (!existsSync('./logs')) {
  mkdirSync('./logs');
}

logInfo('Starting Tulumbak Backend Server', {
  port,
  environment: process.env.NODE_ENV || 'development'
});

connectDB();
connectCloudinary();
connectRedis();

// Initialize default settings on startup (dynamic import to avoid circular dependency)
setTimeout(async () => {
  try {
    const { initDefaultSettings } = await import("./controllers/SettingsController.js");
    await initDefaultSettings();
  } catch (error) {
    console.error("Error initializing settings:", error);
  }
}, 2000);

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
app.use(helmet()); // Security headers
app.use(express.json({ limit: '10mb' })); // Limit payload size
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors());

// Rate limiting
app.use('/api', RateLimiterService.createGeneralLimiter(100, 15 * 60 * 1000)); // 100 requests per 15 minutes

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
app.use('/api/settings', settingsRouter);
app.use('/api/report', reportRouter);
app.use('/api/admin', adminRouter);
app.get('/paytr/payment', (req, res) => {
    const token = req.query.token;
    res.render('layout', { iframetoken: token });
});
app.get('/', (req, res) => {
    res.send("API Working")
})

// Error handlers must be last
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
    logInfo(`Server running on PORT: ${port}`, { port, environment: process.env.NODE_ENV });
    console.log("Server running on PORT: " + port);
})
