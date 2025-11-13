import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const connectCloudinary = async () => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET_KEY,
    })
}

// Enhanced storage with transformations
const getCloudinaryStorage = (folder = 'tulumbak') => {
    return new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: folder,
            resource_type: 'auto',
            allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
            transformation: [
                { width: 2000, height: 2000, crop: 'limit', quality: 'auto' },
                { fetch_format: 'auto' }
            ],
            unique_filename: true
        },
        filename: (req, file, cb) => {
            const name = file.originalname.split('.')[0];
            const cleanName = name.replace(/[^a-zA-Z0-9]/g, '_');
            cb(null, cleanName);
        }
    });
}

// Image transformation utilities
const generateResponsiveImages = (publicId, options = {}) => {
    if (!publicId) return [];

    const sizes = [
        { name: 'thumbnail', width: 150, height: 150 },
        { name: 'small', width: 300, height: 300 },
        { name: 'medium', width: 600, height: 600 },
        { name: 'large', width: 1200, height: 1200 }
    ];

    return sizes.map(size => ({
        name: size.name,
        url: cloudinary.url(publicId, {
            width: size.width,
            height: size.height,
            crop: 'fill',
            quality: 'auto',
            fetch_format: 'auto',
            ...options
        }),
        width: size.width,
        height: size.height
    }));
}

// Get optimized image URL
const getOptimizedUrl = (publicId, options = {}) => {
    return cloudinary.url(publicId, {
        quality: 'auto',
        fetch_format: 'auto',
        crop: 'fill',
        ...options
    });
}

export default connectCloudinary;
export { getCloudinaryStorage, generateResponsiveImages, getOptimizedUrl, cloudinary };