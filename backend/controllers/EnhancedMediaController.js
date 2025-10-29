import Media from '../models/MediaModel.js';
import { getCloudinaryStorage, generateResponsiveImages, getOptimizedUrl, cloudinary } from '../config/cloudinary.js';

// Upload media to Cloudinary
const uploadMedia = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Dosya yüklenmedi"
            });
        }

        // Get folder from request or use default
        const folder = req.body.folder || 'general';
        const category = req.body.category || 'general';

        // Use Cloudinary storage
        const storage = getCloudinaryStorage(folder);

        // Process the file through Cloudinary
        const result = await new Promise((resolve, reject) => {
            storage._handleFile(req, req.file, (error, info) => {
                if (error) reject(error);
                else resolve(info);
            });
        });

        // Generate responsive image URLs
        const responsiveImages = generateResponsiveImages(result.publicId);

        // Create media document
        const media = new Media({
            filename: result.originalname,
            originalName: req.file.originalname,
            mimetype: req.file.mimetype,
            size: result.bytes || req.file.size,
            publicId: result.publicId,
            url: result.url,
            secureUrl: result.secure_url,
            resourceType: result.resource_type || 'image',
            format: result.format,
            width: result.width,
            height: result.height,
            aspectRatio: result.aspectRatio || (result.width / result.height),
            bytes: result.bytes,
            responsive: {
                thumbnail: responsiveImages.find(img => img.name === 'thumbnail')?.url,
                small: responsiveImages.find(img => img.name === 'small')?.url,
                medium: responsiveImages.find(img => img.name === 'medium')?.url,
                large: responsiveImages.find(img => img.name === 'large')?.url
            },
            alt: req.body.alt || req.file.originalname,
            title: req.body.title || req.file.originalname,
            description: req.body.description || '',
            folder: folder,
            category: category,
            tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [],
            uploadedBy: req.body.uploadedBy || 'admin',
            uploadIP: req.ip,
            deviceInfo: {
                userAgent: req.get('User-Agent'),
                platform: req.get('Sec-Ch-UA-Platform')
            },
            processing: {
                status: 'completed'
            }
        });

        await media.save();

        res.json({
            success: true,
            message: "Medya başarıyla yüklendi",
            media: {
                id: media._id,
                filename: media.filename,
                originalName: media.originalName,
                publicId: media.publicId,
                url: media.secureUrl,
                mimetype: media.mimetype,
                size: media.size,
                width: media.width,
                height: media.height,
                format: media.format,
                responsive: media.responsive,
                alt: media.alt,
                title: media.title,
                category: media.category,
                folder: media.folder,
                tags: media.tags,
                createdAt: media.createdAt
            }
        });
    } catch (error) {
        console.error('Enhanced media upload error:', error);
        res.status(500).json({
            success: false,
            message: "Medya yüklenemedi",
            error: error.message
        });
    }
};

// Get media list with advanced filtering
const listMedia = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            category,
            folder,
            search,
            mimetype,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        const filter = { isActive: true };

        if (category && category !== 'all') filter.category = category;
        if (folder && folder !== 'all') filter.folder = folder;
        if (mimetype) filter.mimetype = { $regex: mimetype, $options: 'i' };

        if (search) {
            filter.$or = [
                { originalName: { $regex: search, $options: 'i' } },
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } },
                { filename: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const media = await Media.find(filter)
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Media.countDocuments(filter);

        res.json({
            success: true,
            media: media.map(item => ({
                id: item._id,
                filename: item.filename,
                originalName: item.originalName,
                publicId: item.publicId,
                url: item.secureUrl,
                mimetype: item.mimetype,
                size: item.size,
                width: item.width,
                height: item.height,
                format: item.format,
                responsive: item.responsive,
                alt: item.alt,
                title: item.title,
                description: item.description,
                category: item.category,
                folder: item.folder,
                tags: item.tags,
                views: item.views,
                downloads: item.downloads,
                usedIn: item.usedIn,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt
            })),
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit)),
                hasNext: skip + parseInt(limit) < total,
                hasPrev: parseInt(page) > 1
            }
        });
    } catch (error) {
        console.error('Enhanced media list error:', error);
        res.status(500).json({
            success: false,
            message: "Medya listelenemedi"
        });
    }
};

// Get single media with enhanced details
const getMediaById = async (req, res) => {
    try {
        const media = await Media.findById(req.params.id);

        if (!media) {
            return res.status(404).json({
                success: false,
                message: "Medya bulunamadı"
            });
        }

        // Track view
        await Media.findByIdAndUpdate(req.params.id, {
            $inc: { views: 1 },
            lastViewed: new Date()
        });

        res.json({
            success: true,
            media: {
                id: media._id,
                filename: media.filename,
                originalName: media.originalName,
                publicId: media.publicId,
                url: media.secureUrl,
                mimetype: media.mimetype,
                size: media.size,
                width: media.width,
                height: media.height,
                aspectRatio: media.aspectRatio,
                format: media.format,
                responsive: media.responsive,
                alt: media.alt,
                title: media.title,
                description: media.description,
                category: media.category,
                folder: media.folder,
                tags: media.tags,
                views: media.views,
                downloads: media.downloads,
                lastViewed: media.lastViewed,
                usedIn: media.usedIn,
                exif: media.exif,
                uploadedBy: media.uploadedBy,
                deviceInfo: media.deviceInfo,
                createdAt: media.createdAt,
                updatedAt: media.updatedAt
            }
        });
    } catch (error) {
        console.error('Enhanced media get error:', error);
        res.status(500).json({
            success: false,
            message: "Medya alınamadı"
        });
    }
};

// Update media metadata
const updateMedia = async (req, res) => {
    try {
        const {
            title,
            alt,
            description,
            folder,
            category,
            tags,
            isPublic
        } = req.body;

        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (alt !== undefined) updateData.alt = alt;
        if (description !== undefined) updateData.description = description;
        if (folder !== undefined) updateData.folder = folder;
        if (category !== undefined) updateData.category = category;
        if (tags !== undefined) {
            updateData.tags = Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim());
        }
        if (isPublic !== undefined) updateData.isPublic = isPublic;

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
        console.error('Enhanced media update error:', error);
        res.status(500).json({
            success: false,
            message: "Medya güncellenemedi"
        });
    }
};

// Delete media from Cloudinary and database
const deleteMedia = async (req, res) => {
    try {
        const media = await Media.findById(req.params.id);

        if (!media) {
            return res.status(404).json({
                success: false,
                message: "Medya bulunamadı"
            });
        }

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(media.publicId);

        // Check usage before deleting from database
        if (media.usedIn && media.usedIn.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Bu medya başka yerlerde kullanıldığı için silinemez",
                usedIn: media.usedIn
            });
        }

        // Delete from database
        await Media.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Medya silindi"
        });
    } catch (error) {
        console.error('Enhanced media delete error:', error);
        res.status(500).json({
            success: false,
            message: "Medya silinemedi"
        });
    }
};

// Track media usage
const trackUsage = async (req, res) => {
    try {
        const { mediaId, type, id, url } = req.body;

        const media = await Media.findById(mediaId);
        if (!media) {
            return res.status(404).json({
                success: false,
                message: "Medya bulunamadı"
            });
        }

        // Add usage tracking
        const usageEntry = {
            type,
            id,
            url,
            addedAt: new Date()
        };

        // Check if already exists
        const existingUsageIndex = media.usedIn.findIndex(
            usage => usage.type === type && usage.id === id
        );

        if (existingUsageIndex >= 0) {
            // Update existing usage
            media.usedIn[existingUsageIndex] = usageEntry;
        } else {
            // Add new usage
            media.usedIn.push(usageEntry);
        }

        await media.save();

        res.json({
            success: true,
            message: "Kullanım takip edildi"
        });
    } catch (error) {
        console.error('Media usage tracking error:', error);
        res.status(500).json({
            success: false,
            message: "Kullanım takibi yapılamadı"
        });
    }
};

// Get optimized image URL with transformations
const getOptimizedImage = async (req, res) => {
    try {
        const { publicId, width, height, quality, format } = req.query;

        if (!publicId) {
            return res.status(400).json({
                success: false,
                message: "Public ID gereklidir"
            });
        }

        const options = {
            quality: quality || 'auto',
            fetch_format: format || 'auto',
            crop: 'fill'
        };

        if (width) options.width = parseInt(width);
        if (height) options.height = parseInt(height);

        const optimizedUrl = getOptimizedUrl(publicId, options);

        res.json({
            success: true,
            url: optimizedUrl,
            options
        });
    } catch (error) {
        console.error('Optimized image error:', error);
        res.status(500).json({
            success: false,
            message: "Görüntü optimize edilemedi"
        });
    }
};

export {
    uploadMedia,
    listMedia,
    getMediaById,
    updateMedia,
    deleteMedia,
    trackUsage,
    getOptimizedImage
};