import Slider from '../models/SliderModel.js';

// Get all sliders
const listSliders = async (req, res) => {
    try {
        const sliders = await Slider.find({ isActive: true }).sort({ order: 1 });
        res.json({ success: true, sliders });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Sliderler listelenemedi" });
    }
};

// Add new slider
const addSlider = async (req, res) => {
    try {
        const { title, subtitle, description, buttonText, buttonLink, order } = req.body;
        
        let image = req.file ? `/uploads/${req.file.filename}` : '';

        const slider = new Slider({
            title,
            subtitle,
            description,
            buttonText,
            buttonLink: buttonLink || '/collection',
            image,
            order: parseInt(order) || 0
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
        const { title, subtitle, description, buttonText, buttonLink, order, isActive } = req.body;
        
        const updateData = {
            title,
            subtitle,
            description,
            buttonText,
            buttonLink: buttonLink || '/collection',
            order: parseInt(order) || 0,
            isActive: isActive !== undefined ? isActive : true
        };

        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }

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

export { listSliders, addSlider, updateSlider, deleteSlider };
