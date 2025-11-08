import jwt from 'jsonwebtoken';
import adminModel from '../models/AdminModel.js';
import logger from '../utils/logger.js';

/**
 * Admin Authentication Middleware
 * Updated to work with new database-based admin system
 */
const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.headers;
        
        if (!token) {
            return res.json({success: false, message: 'Not authorized login again'});
        }

        // Verify JWT token
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if token has required fields (new system)
        if (!token_decode.email) {
            // Fallback to old system for backward compatibility
            if (token_decode === process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
                return next();
            }
            return res.json({success: false, message: 'Not authorized login again'});
        }

        // Get admin from database
        const admin = await adminModel.findOne({ 
            email: token_decode.email,
            isActive: true 
        });

        if (!admin) {
            logger.warn('Invalid admin token', { email: token_decode.email });
            return res.json({success: false, message: 'Not authorized login again'});
        }

        // Attach admin to request object
        req.admin = admin;
        next();
    } catch (error) {
        logger.error('Admin auth error', { error: error.message });
        res.json({success: false, message: 'Not authorized login again'});
    }
}

export default adminAuth;