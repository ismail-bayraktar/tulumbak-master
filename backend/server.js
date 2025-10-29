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
import mediaRouter from "./routes/MediaRoute.js";
import enhancedMediaRouter from "./routes/EnhancedMediaRoute.js";
import courierManagementRouter from "./routes/CourierManagementRoute.js";
import branchRouter from "./routes/BranchRoute.js";
import RateLimiterService from "./services/RateLimiter.js";
import logger, { logInfo } from "./utils/logger.js";
import { initSentry } from "./utils/sentry.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { swaggerDocs } from "./config/swagger.js";

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
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
})); // Security headers
app.use(express.json({ limit: '10mb' })); // Limit payload size
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000', 'http://localhost:4001'], // Admin and frontend dev servers
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token']
}));

// Rate limiting
app.use('/api', RateLimiterService.createGeneralLimiter(100, 15 * 60 * 1000)); // 100 requests per 15 minutes

// Static files for uploads with enhanced CORS
app.use('/uploads', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
}, express.static(path.join(__dirname, 'uploads')));

// Alternative 2: Image proxy endpoint (ACTIVE SOLUTION)
app.get('/api/image-proxy/:filename', (req, res) => {
    const filename = req.params.filename;
    const imagePath = path.join(__dirname, 'uploads', filename);

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Send image
    res.sendFile(imagePath, (err) => {
        if (err) {
            res.status(404).json({ error: 'Image not found' });
        }
    });
});

// API ENDPOINTS
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/paytr', paytrRouter);
app.use('/api/slider', sliderRouter);
app.use('/api/media', mediaRouter);
app.use('/api/media-enhanced', enhancedMediaRouter);
app.use('/api/courier', courierRouter);
app.use('/api/delivery', deliveryRouter);
app.use('/api/coupon', couponRouter);
app.use('/api/corporate', corporateRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/report', reportRouter);
app.use('/api/admin', adminRouter);
app.use('/api/courier-management', courierManagementRouter);
app.use('/api/branches', branchRouter);

// Swagger Documentation
swaggerDocs(app);
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
