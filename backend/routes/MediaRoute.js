import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
    uploadMedia,
    listMedia,
    getMediaById,
    updateMedia,
    deleteMedia,
    getMediaBase64
} from '../controllers/MediaController.js';

const router = express.Router();

// Enhanced Image Upload Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Create unique filename with timestamp and random string
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        cb(null, `${name}-${uniqueSuffix}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Sadece görsel dosyaları yüklenebilir'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// Routes
router.post('/upload', upload.single('file'), uploadMedia);
router.get('/list', listMedia);
router.get('/:id', getMediaById);
router.get('/:id/base64', getMediaBase64);
router.put('/:id', updateMedia);
router.delete('/:id', deleteMedia);

export default router;