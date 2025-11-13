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

const router = express.Router();

// Memory storage for MediaService processing
const storage = multer.memoryStorage();

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

// Upload middleware with memory storage
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB
        files: 10 // Maximum 10 files at once
    }
});

// Routes
router.post('/upload', upload.single('file'), uploadMedia);

// Upload with specific folder
router.post('/upload/:folder', upload.single('file'), uploadMedia);

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
router.post('/bulk-upload', upload.array('files', 10), uploadMedia);

export default router;