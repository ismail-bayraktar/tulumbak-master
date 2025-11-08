import userModel from "../models/UserModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET);
}

// Route for user login
const loginUser = async (req, res,) => {
    try {
        const {email, password} = req.body;

        const user = await userModel.findOne({email});
        if(!user) {
            return res.json({success: false, message: "Mail does not exist"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(isMatch) {
            const token = createToken(user._id);
            res.json({success: true, token})
        } else {
            res.json({success: false, message: "Invalid credentials"});
        }
    } catch (error) {
        logger.error('Error in user login', { error: error.message, stack: error.stack });
        res.json({success: false, message: error.message});
    }
}

// Route for register
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Checking user already exists or not!
        const exists = await userModel.findOne({email});
        if (exists) {
            return res.json({success: false, message: 'User already exists'});
        }

        // Validating email format & Strong password!
        if (!validator.isEmail(email)) {
            return res.json({success: false, message: 'Please enter a valid email'});
        }
        if (password.length < 8) {
            return res.json({success: false, message: 'Please enter strong password'});
        }

        // Hashing user password!
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
        })

        const user = await newUser.save();
        const token = createToken(user._id);
        logger.info('User registered successfully', { userId: user._id, email });
        res.json({success: true, token});
    } catch (error) {
        logger.error('Error in user registration', { error: error.message, stack: error.stack });
        res.json({success: false, message: error.message});
    }
}

// Route for admin login (Updated to use database)
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.json({success: false, message: 'Email and password required'});
        }

        // Import adminModel dynamically to avoid circular dependency
        const adminModel = (await import('../models/AdminModel.js')).default;
        
        const admin = await adminModel.findOne({ email, isActive: true });

        if (!admin) {
            return res.json({success: false, message: "Invalid credentials"});
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (!isPasswordValid) {
            return res.json({success: false, message: "Invalid credentials"});
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: admin._id,
                email: admin.email,
                role: admin.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        logger.info('Admin login successful', { email });
        res.json({success: true, token});
    } catch (error) {
        logger.error('Error in admin login', { error: error.message, stack: error.stack, email });
        res.json({success: false, message: error.message});
    }
}

export { loginUser, registerUser, adminLogin };