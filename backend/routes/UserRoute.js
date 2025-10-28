import express from 'express';
import { loginUser, registerUser, adminLogin } from "../controllers/UserController.js";
import RateLimiterService from "../services/RateLimiter.js";

const userRouter = express.Router();

// Apply rate limiting to authentication endpoints
userRouter.post("/register", RateLimiterService.createAuthLimiter(), registerUser);
userRouter.post("/login", RateLimiterService.createAuthLimiter(), loginUser);
userRouter.post("/admin", RateLimiterService.createAuthLimiter(), adminLogin);

export default userRouter;