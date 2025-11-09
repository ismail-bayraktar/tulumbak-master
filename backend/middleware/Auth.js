import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";

const authUser = async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
        return res.json({success: false, message: "Not authorized login again!"});
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = token_decode.id;
        next();
    } catch (error) {
        logger.error('Auth middleware error', { error: error.message, stack: error.stack, token: token?.substring(0, 20) + '...' });
        res.status(401).json({success: false, message: error.message});
    }
}

export default authUser;