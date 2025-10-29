import Media from '../models/MediaModel.js';
import fs from 'fs';
import path from 'path';

// Upload media file
const uploadMedia = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Dosya yüklenmedi"
            });
        }

        // Get image dimensions if it's an image
        let width, height;
        if (req.file.mimetype.startsWith('image/')) {
            try {
                // For now, we'll skip image dimension detection
                // In a real implementation, you'd use sharp or jimp
                width = null;
                height = null;
            } catch (error) {
                console.log('Could not get image dimensions:', error);
            }
        }

        const media = new Media({
            filename: req.file.filename,
            originalName: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            path: req.file.path,
            url: `/uploads/${req.file.filename}`,
            width,
            height,
            folder: req.body.folder || 'general',
            category: req.body.category || 'general',
            tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [],
            alt: req.body.alt || req.file.originalname,
            title: req.body.title || req.file.originalname,
            description: req.body.description || '',
            uploadedBy: req.body.uploadedBy || 'admin'
        });

        await media.save();

        res.json({
            success: true,
            message: "Medya yüklendi",
            media: {
                id: media._id,
                filename: media.filename,
                originalName: media.originalName,
                url: `${req.protocol}://${req.get('host')}/uploads/${media.filename}`,
                mimetype: media.mimetype,
                size: media.size,
                width: media.width,
                height: media.height,
                alt: media.alt,
                title: media.title,
                category: media.category,
                folder: media.folder,
                tags: media.tags
            }
        });
    } catch (error) {
        console.error('Media upload error:', error);
        res.status(500).json({
            success: false,
            message: "Medya yüklenemedi"
        });
    }
};

// Get all media files
const listMedia = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            category,
            folder,
            search,
            mimetype
        } = req.query;

        const filter = { isActive: true };

        if (category) filter.category = category;
        if (folder) filter.folder = folder;
        if (mimetype) filter.mimetype = { $regex: mimetype, $options: 'i' };
        if (search) {
            filter.$or = [
                { originalName: { $regex: search, $options: 'i' } },
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const media = await Media.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Media.countDocuments(filter);

        res.json({
            success: true,
            media: media.map(item => ({
                id: item._id,
                filename: item.filename,
                originalName: item.originalName,
                url: `${req.protocol}://${req.get('host')}/uploads/${item.filename}`,
                mimetype: item.mimetype,
                size: item.size,
                width: item.width,
                height: item.height,
                alt: item.alt,
                title: item.title,
                category: item.category,
                folder: item.folder,
                tags: item.tags,
                createdAt: item.createdAt
            })),
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Media list error:', error);
        res.status(500).json({
            success: false,
            message: "Medya listelenemedi"
        });
    }
};

// Get media by ID
const getMediaById = async (req, res) => {
    try {
        const media = await Media.findById(req.params.id);

        if (!media) {
            return res.status(404).json({
                success: false,
                message: "Medya bulunamadı"
            });
        }

        res.json({
            success: true,
            media: {
                id: media._id,
                filename: media.filename,
                originalName: media.originalName,
                url: `${req.protocol}://${req.get('host')}/uploads/${media.filename}`,
                mimetype: media.mimetype,
                size: media.size,
                width: media.width,
                height: media.height,
                alt: media.alt,
                title: media.title,
                category: media.category,
                folder: media.folder,
                tags: media.tags,
                description: media.description,
                createdAt: media.createdAt
            }
        });
    } catch (error) {
        console.error('Media get error:', error);
        res.status(500).json({
            success: false,
            message: "Medya alınamadı"
        });
    }
};

// Update media
const updateMedia = async (req, res) => {
    try {
        const {
            title,
            alt,
            description,
            folder,
            category,
            tags
        } = req.body;

        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (alt !== undefined) updateData.alt = alt;
        if (description !== undefined) updateData.description = description;
        if (folder !== undefined) updateData.folder = folder;
        if (category !== undefined) updateData.category = category;
        if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim());

        const media = await Media.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!media) {
            return res.status(404).json({
                success: false,
                message: "Medya bulunamadı"
            });
        }

        res.json({
            success: true,
            message: "Medya güncellendi",
            media
        });
    } catch (error) {
        console.error('Media update error:', error);
        res.status(500).json({
            success: false,
            message: "Medya güncellenemedi"
        });
    }
};

// Delete media
const deleteMedia = async (req, res) => {
    try {
        const media = await Media.findById(req.params.id);

        if (!media) {
            return res.status(404).json({
                success: false,
                message: "Medya bulunamadı"
            });
        }

        // Delete physical file
        const filePath = path.join(process.cwd(), 'uploads', media.filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Delete database record
        await Media.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Medya silindi"
        });
    } catch (error) {
        console.error('Media delete error:', error);
        res.status(500).json({
            success: false,
            message: "Medya silinemedi"
        });
    }
};

// Get media as base64 (for admin panel display)
const getMediaBase64 = async (req, res) => {
    try {
        const media = await Media.findById(req.params.id);

        if (!media) {
            return res.status(404).json({
                success: false,
                message: "Medya bulunamadı"
            });
        }

        const filePath = path.join(process.cwd(), 'uploads', media.filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: "Dosya bulunamadı"
            });
        }

        const fileBuffer = fs.readFileSync(filePath);
        const base64 = fileBuffer.toString('base64');
        const dataUrl = `data:${media.mimetype};base64,${base64}`;

        // Add CORS headers for base64 response
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        res.json({
            success: true,
            dataUrl,
            media: {
                id: media._id,
                filename: media.filename,
                originalName: media.originalName,
                mimetype: media.mimetype,
                size: media.size,
                alt: media.alt,
                title: media.title
            }
        });
    } catch (error) {
        console.error('Media base64 error:', error);
        res.status(500).json({
            success: false,
            message: "Medya alınamadı"
        });
    }
};

export {
    uploadMedia,
    listMedia,
    getMediaById,
    updateMedia,
    deleteMedia,
    getMediaBase64
};