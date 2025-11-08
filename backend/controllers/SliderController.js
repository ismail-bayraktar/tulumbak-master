import Slider from '../models/SliderModel.js';
import logger from '../utils/logger.js';

// Get all sliders for frontend
const listSliders = async (req, res) => {
    try {
        const now = new Date();
        const sliders = await Slider.find({
            isActive: true,
            $or: [
                { startDate: { $exists: false } },
                { startDate: { $lte: now } }
            ],
            $or: [
                { endDate: { $exists: false } },
                { endDate: { $gte: now } }
            ]
        }).sort({ order: 1 });

        res.json({ success: true, sliders });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Sliderler listelenemedi" });
    }
};

// Get all sliders for admin (including inactive)
const listSlidersAdmin = async (req, res) => {
    try {
        logger.info('Admin slider list requested', { adminEmail: req.admin?.email });
        const sliders = await Slider.find({}).sort({ order: 1 });
        logger.info(`Found ${sliders.length} sliders`);
        res.json({ success: true, sliders });
    } catch (error) {
        logger.error('Error in listSlidersAdmin', { error: error.message, stack: error.stack });
        res.status(500).json({ success: false, message: "Sliderler listelenemedi" });
    }
};

// Track slider view
const trackSliderView = async (req, res) => {
    try {
        const { id } = req.params;
        await Slider.findByIdAndUpdate(id, {
            $inc: { viewCount: 1 },
            lastViewed: new Date()
        });
        res.json({ success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "View takibi yapılamadı" });
    }
};

// Track slider click
const trackSliderClick = async (req, res) => {
    try {
        const { id } = req.params;
        await Slider.findByIdAndUpdate(id, {
            $inc: { clickCount: 1 }
        });
        res.json({ success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Click takibi yapılamadı" });
    }
};

// Add new slider
const addSlider = async (req, res) => {
    try {
        const {
            title, subtitle, description, buttonText, buttonLink,
            template, buttonStyle, mobileImage, backgroundImage,
            overlayOpacity, textColor, altText, seoTitle,
            order, startDate, endDate
        } = req.body;

        let image = '';

        // Option 1: File path (original method)
        if (req.file) {
            image = `/uploads/${req.file.filename}`;
        }

        // Option 2: Base64 (alternative method - uncomment to use)
        // if (req.body.imageBase64) {
        //     image = req.body.imageBase64;
        // }

        const slider = new Slider({
            template: template || 'split-left',
            title,
            subtitle,
            description,
            buttonText,
            buttonLink: buttonLink || '/collection',
            buttonStyle: buttonStyle || 'primary',
            image,
            mobileImage,
            backgroundImage,
            overlayOpacity: parseInt(overlayOpacity) || 0,
            textColor: textColor || 'auto',
            altText: altText || '',
            seoTitle: seoTitle || '',
            order: parseInt(order) || 0,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined
        });

        await slider.save();
        res.json({ success: true, message: "Slider eklendi" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Slider eklenemedi" });
    }
};

// Update slider
const updateSlider = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title, subtitle, description, buttonText, buttonLink,
            template, buttonStyle, mobileImage, backgroundImage,
            overlayOpacity, textColor, altText, seoTitle,
            order, isActive, startDate, endDate
        } = req.body;

        const updateData = {
            template: template || 'split-left',
            title,
            subtitle,
            description,
            buttonText,
            buttonLink: buttonLink || '/collection',
            buttonStyle: buttonStyle || 'primary',
            overlayOpacity: parseInt(overlayOpacity) || 0,
            textColor: textColor || 'auto',
            altText: altText || '',
            seoTitle: seoTitle || '',
            order: parseInt(order) || 0,
            isActive: isActive !== undefined ? isActive : true
        };

        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }

        if (mobileImage) updateData.mobileImage = mobileImage;
        if (backgroundImage) updateData.backgroundImage = backgroundImage;
        if (startDate) updateData.startDate = new Date(startDate);
        if (endDate) updateData.endDate = new Date(endDate);

        await Slider.findByIdAndUpdate(id, updateData);
        res.json({ success: true, message: "Slider güncellendi" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Slider güncellenemedi" });
    }
};

// Delete slider
const deleteSlider = async (req, res) => {
    try {
        const { id } = req.params;
        await Slider.findByIdAndDelete(id);
        res.json({ success: true, message: "Slider silindi" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Slider silinemedi" });
    }
};

export {
    listSliders,
    listSlidersAdmin,
    trackSliderView,
    trackSliderClick,
    addSlider,
    updateSlider,
    deleteSlider
};
