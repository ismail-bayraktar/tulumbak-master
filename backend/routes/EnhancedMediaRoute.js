import express from 'express';
import multer from 'multer';
import {
    uploadMedia,
    listMedia,
    getMediaById,
    updateMedia,
    deleteMedia,
    trackUsage,
    getOptimizedImage
} from '../controllers/EnhancedMediaController.js';
import { getCloudinaryStorage } from '../config/cloudinary.js';

const router = express.Router();

// Enhanced Upload Configuration for Cloudinary
const getStorageForFolder = (folder) => {
    return getCloudinaryStorage(folder);
};

// File filter for media uploads
const fileFilter = (req, file, cb) => {
    // Accept images, videos and documents
    const allowedTypes = /jpeg|jpg|png|gif|webp|avif|svg|pdf|doc|docx|txt/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Sadece resim, video ve doküman dosyaları yüklenebilir'), false);
    }
};

// Dynamic upload middleware based on folder
const getUploadMiddleware = (folder = 'general') => {
    const storage = getStorageForFolder(folder);
    return multer({
        storage: storage,
        fileFilter: fileFilter,
        limits: {
            fileSize: 50 * 1024 * 1024, // 50MB
            files: 10 // Maximum 10 files at once
        }
    });
};

// Routes
router.post('/upload',
    getUploadMiddleware('general'),
    uploadMedia
);

// Upload with specific folder
router.post('/upload/:folder',
    (req, res, next) => {
        const folder = req.params.folder || 'general';
        const storage = getStorageForFolder(folder);
        const upload = multer({
            storage: storage,
            fileFilter: fileFilter,
            limits: {
                fileSize: 50 * 1024 * 1024,
                files: 10
            }
        }).single('file');

        upload(req, res, (err) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }
            next();
        });
    },
    uploadMedia
);

// Media listing with pagination and filtering
router.get('/list', listMedia);

// Get single media
router.get('/:id', getMediaById);

// Get optimized image URL
router.get('/:id/optimize', getOptimizedImage);

// Update media metadata
router.put('/:id', updateMedia);

// Track media usage
router.post('/:id/usage', trackUsage);

// Delete media
router.delete('/:id', deleteMedia);

// Bulk operations
router.post('/bulk-upload',
    getUploadMiddleware('bulk'),
    uploadMedia
);

export default router;