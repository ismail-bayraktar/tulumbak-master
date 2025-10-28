import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import adminModel from '../models/AdminModel.js';
import logger, { logInfo, logError } from '../utils/logger.js';
import { updateLastLogin } from '../middleware/PermissionMiddleware.js';

/**
 * Admin Login
 */
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, message: 'Email and password required' });
    }

    const admin = await adminModel.findOne({ email, isActive: true });

    if (!admin) {
      return res.json({ success: false, message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      logError(new Error('Invalid password'), { email, attempt: 'login' });
      return res.json({ success: false, message: 'Invalid credentials' });
    }

    // Update last login
    await updateLastLogin(email);

    // Generate JWT
    const token = jwt.sign(
      { 
        id: admin._id,
        email: admin.email,
        role: admin.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    logInfo('Admin logged in', { email, role: admin.role });

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions
      }
    });
  } catch (error) {
    logError(error, { context: 'admin login' });
    res.json({ success: false, message: error.message });
  }
};

/**
 * Get all admins (Super Admin only)
 */
const getAllAdmins = async (req, res) => {
  try {
    const admins = await adminModel.find({});
    
    res.json({
      success: true,
      admins: admins.map(admin => ({
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions,
        isActive: admin.isActive,
        lastLogin: admin.lastLogin,
        createdAt: admin.createdAt
      }))
    });
  } catch (error) {
    logError(error, { context: 'get all admins' });
    res.json({ success: false, message: error.message });
  }
};

/**
 * Create new admin (Super Admin only)
 */
const createAdmin = async (req, res) => {
  try {
    const { name, email, password, role, permissions } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: 'Name, email and password required' });
    }

    // Check if admin exists
    const existingAdmin = await adminModel.findOne({ email });
    if (existingAdmin) {
      return res.json({ success: false, message: 'Admin with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const adminData = {
      name,
      email,
      password: hashedPassword,
      role: role || 'admin',
      permissions: permissions || [],
      isActive: true
    };

    const admin = new adminModel(adminData);
    await admin.save();

    logInfo('New admin created', { email, role, createdBy: req.admin.email });

    res.json({
      success: true,
      message: 'Admin created successfully',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions
      }
    });
  } catch (error) {
    logError(error, { context: 'create admin' });
    res.json({ success: false, message: error.message });
  }
};

/**
 * Update admin (Super Admin or same user)
 */
const updateAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;
    const { name, email, role, permissions, isActive } = req.body;

    // Check if user is updating themselves or has super_admin role
    if (req.admin.role !== 'super_admin' && req.admin._id.toString() !== adminId) {
      return res.json({ success: false, message: 'Permission denied' });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role && req.admin.role === 'super_admin') updateData.role = role;
    if (permissions) updateData.permissions = permissions;
    if (isActive !== undefined && req.admin.role === 'super_admin') updateData.isActive = isActive;
    updateData.updatedAt = new Date();

    const admin = await adminModel.findByIdAndUpdate(adminId, updateData, { new: true });

    if (!admin) {
      return res.json({ success: false, message: 'Admin not found' });
    }

    logInfo('Admin updated', { adminId, updatedBy: req.admin.email });

    res.json({
      success: true,
      message: 'Admin updated successfully',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions,
        isActive: admin.isActive
      }
    });
  } catch (error) {
    logError(error, { context: 'update admin' });
    res.json({ success: false, message: error.message });
  }
};

/**
 * Delete admin (Super Admin only)
 */
const deleteAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;

    // Prevent self-deletion
    if (req.admin._id.toString() === adminId) {
      return res.json({ success: false, message: 'Cannot delete yourself' });
    }

    const admin = await adminModel.findByIdAndDelete(adminId);

    if (!admin) {
      return res.json({ success: false, message: 'Admin not found' });
    }

    logInfo('Admin deleted', { adminId, deletedBy: req.admin.email });

    res.json({ success: true, message: 'Admin deleted successfully' });
  } catch (error) {
    logError(error, { context: 'delete admin' });
    res.json({ success: false, message: error.message });
  }
};

/**
 * Get current admin profile
 */
const getProfile = async (req, res) => {
  try {
    const admin = await adminModel.findById(req.admin._id);
    
    res.json({
      success: true,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions,
        lastLogin: admin.lastLogin
      }
    });
  } catch (error) {
    logError(error, { context: 'get profile' });
    res.json({ success: false, message: error.message });
  }
};

export {
  adminLogin,
  getAllAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  getProfile
};

