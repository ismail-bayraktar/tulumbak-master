import express from 'express';
import multer from 'multer';
import path from 'path';
import {
    listSliders,
    listSlidersAdmin,
    trackSliderView,
    trackSliderClick,
    addSlider,
    updateSlider,
    deleteSlider
} from '../controllers/SliderController.js';

const router = express.Router();

// Image Upload Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({ storage });

// Get all sliders (for frontend)
router.get('/list', listSliders);

// Get all sliders (for admin - includes inactive)
router.get('/admin/list', listSlidersAdmin);

// Track analytics
router.post('/track/view/:id', trackSliderView);
router.post('/track/click/:id', trackSliderClick);

// Add slider (admin)
router.post('/add', upload.single('image'), addSlider);

// Update slider (admin)
router.put('/update/:id', upload.single('image'), updateSlider);

// Delete slider (admin)
router.delete('/delete/:id', deleteSlider);

export default router;
