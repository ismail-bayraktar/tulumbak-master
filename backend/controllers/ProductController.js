import productModel from "../models/ProductModel.js";
import Media from "../models/MediaModel.js";
import { validationResult } from "express-validator";
import logger from "../utils/logger.js";


const parseSizes = (sizes) => {
    if (!sizes) return [];
    if (Array.isArray(sizes)) return sizes;
    return [sizes];
}

const parsePersonCounts = (personCounts) => {
    if (!personCounts) return [];
    if (Array.isArray(personCounts)) return personCounts;
    if (typeof personCounts === 'string') return personCounts.split(',').map(p => p.trim());
    return [];
};

const addProduct = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { name, description, basePrice, category, subCategory, sizes, personCounts, bestseller, stock, allergens, ingredients, shelfLife, storageInfo, weights, freshType, packaging, giftWrap, labels } = req.body;
        
        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        // Upload images with multer (backward compatibility)
        const imagesUrl = images.map(item => `/assets/${item.filename}`);

        // Save images to Media model for better management
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const mediaIds = [];
        
        if (images.length > 0) {
            try {
                const mediaDocs = await Promise.all(
                    images.map(async (file, index) => {
                        const media = new Media({
                            filename: file.filename,
                            originalName: file.originalname,
                            mimetype: file.mimetype,
                            size: file.size,
                            path: file.path,
                            url: `/assets/${file.filename}`,
                            secureUrl: `${baseUrl}/assets/${file.filename}`,
                            category: 'product',
                            folder: 'products',
                            alt: `${name} - Ürün görseli ${index + 1}`,
                            title: `${name} - Görsel ${index + 1}`,
                            description: `${name} ürünü için görsel`,
                            uploadedBy: 'admin',
                            usedIn: [{
                                type: 'product',
                                id: null, // Will be updated after product is saved
                                url: `/product/${null}`,
                                addedAt: new Date()
                            }]
                        });
                        await media.save();
                        return media._id.toString();
                    })
                );
                mediaIds.push(...mediaDocs);
                logger.info('Product images saved to Media model', { mediaCount: mediaDocs.length });
            } catch (mediaError) {
                logger.error('Error saving images to Media model', { error: mediaError.message });
                // Continue even if Media save fails (backward compatibility)
            }
        }

        logger.info('Adding product', { name, category, basePrice, imageCount: imagesUrl.length });

        const parsedSizes = parseSizes(sizes);
        const parseNumberArray = (val) => {
            if (!val) return [];
            if (Array.isArray(val)) return val.map((v) => Number(v));
            if (typeof val === 'string') return val.split(',').map((v) => Number(v.trim())).filter((n) => !Number.isNaN(n));
            return [];
        }
        const parsedWeights = parseNumberArray(weights);
        const parsedLabels = Array.isArray(labels) ? labels : (typeof labels === 'string' ? labels.split(',').map((s)=>s.trim()) : []);

        const sizePrices = parsedSizes.map(size => ({
            size,
            price: basePrice * size
        }))

        const productData = {
            name,
            description,
            category,
            basePrice: Number(basePrice),
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            sizes: parsedSizes,
            weights: parsedWeights,
            freshType: freshType === 'kuru' ? 'kuru' : 'taze',
            packaging: packaging === 'özel' ? 'özel' : 'standart',
            giftWrap: giftWrap === 'true' || giftWrap === true,
            labels: parsedLabels,
            personCounts: parsePersonCounts(personCounts),
            image: imagesUrl,
            date: Date.now(),
            sizePrices,
            stock: Number(stock ?? 0),
            allergens: allergens || "",
            ingredients: ingredients || "",
            shelfLife: shelfLife || "",
            storageInfo: storageInfo || ""
        }
        const product = new productModel(productData);
        await product.save();

        // Update Media records with product ID
        if (mediaIds.length > 0) {
            try {
                await Promise.all(
                    mediaIds.map(async (mediaId) => {
                        await Media.findByIdAndUpdate(mediaId, {
                            $set: {
                                'usedIn.0.id': product._id.toString(),
                                'usedIn.0.url': `/product/${product._id}`
                            }
                        });
                    })
                );
                logger.info('Media records updated with product ID', { productId: product._id });
            } catch (mediaUpdateError) {
                logger.error('Error updating Media records', { error: mediaUpdateError.message });
                // Continue even if update fails
            }
        }

        logger.info('Product added successfully', { productId: product._id, name });
        res.json({success: true, message: "Product added successfully"});

    } catch (error) {
        logger.error('Error adding product', { error: error.message, stack: error.stack });
        res.json({success: false, message: error.message});
    }
}

    const updateProduct = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { id, name, description, basePrice, category, subCategory, sizes, personCounts, bestseller, stock, allergens, ingredients, shelfLife, storageInfo, weights, freshType, packaging, giftWrap, labels } = req.body;

        if (!id) {
            return res.status(400).json({ success: false, message: "Product id is required" });
        }

        const image1 = req.files?.image1 && req.files.image1[0];
        const image2 = req.files?.image2 && req.files.image2[0];
        const image3 = req.files?.image3 && req.files.image3[0];
        const image4 = req.files?.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);
        const updatePayload = {};

        if (name !== undefined) updatePayload.name = name;
        if (description !== undefined) updatePayload.description = description;
        if (category !== undefined) updatePayload.category = category;
        if (subCategory !== undefined) updatePayload.subCategory = subCategory;
        if (basePrice !== undefined) updatePayload.basePrice = Number(basePrice);
        if (bestseller !== undefined) updatePayload.bestseller = bestseller === "true" || bestseller === true;
        if (stock !== undefined) updatePayload.stock = Number(stock);
        
        // Yeni alanlar
        if (personCounts !== undefined) updatePayload.personCounts = parsePersonCounts(personCounts);
        if (allergens !== undefined) updatePayload.allergens = allergens;
        if (ingredients !== undefined) updatePayload.ingredients = ingredients;
        if (shelfLife !== undefined) updatePayload.shelfLife = shelfLife;
        if (storageInfo !== undefined) updatePayload.storageInfo = storageInfo;
        if (weights !== undefined) {
            const parseNumberArray = (val) => {
                if (!val) return [];
                if (Array.isArray(val)) return val.map((v) => Number(v));
                if (typeof val === 'string') return val.split(',').map((v) => Number(v.trim())).filter((n) => !Number.isNaN(n));
                return [];
            }
            updatePayload.weights = parseNumberArray(weights);
        }
        if (freshType !== undefined) updatePayload.freshType = freshType === 'kuru' ? 'kuru' : 'taze';
        if (packaging !== undefined) updatePayload.packaging = packaging === 'özel' ? 'özel' : 'standart';
        if (giftWrap !== undefined) updatePayload.giftWrap = giftWrap === 'true' || giftWrap === true;
        if (labels !== undefined) updatePayload.labels = Array.isArray(labels) ? labels : (typeof labels === 'string' ? labels.split(',').map((s)=>s.trim()) : []);

        const parsedSizes = parseSizes(sizes);
        if (parsedSizes.length) {
            updatePayload.sizes = parsedSizes;
            updatePayload.sizePrices = parsedSizes.map(size => ({
                size,
                price: Number(basePrice) * size
            }));
        }

        if (images.length) {
            const imagesUrl = images.map(item => `/assets/${item.filename}`);
            updatePayload.image = imagesUrl;

            // Save new images to Media model
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            const mediaIds = [];
            
            try {
                const mediaDocs = await Promise.all(
                    images.map(async (file, index) => {
                        const media = new Media({
                            filename: file.filename,
                            originalName: file.originalname,
                            mimetype: file.mimetype,
                            size: file.size,
                            path: file.path,
                            url: `/assets/${file.filename}`,
                            secureUrl: `${baseUrl}/assets/${file.filename}`,
                            category: 'product',
                            folder: 'products',
                            alt: `${name || 'Ürün'} - Ürün görseli ${index + 1}`,
                            title: `${name || 'Ürün'} - Görsel ${index + 1}`,
                            description: `${name || 'Ürün'} ürünü için görsel`,
                            uploadedBy: 'admin',
                            usedIn: [{
                                type: 'product',
                                id: id,
                                url: `/product/${id}`,
                                addedAt: new Date()
                            }]
                        });
                        await media.save();
                        return media._id.toString();
                    })
                );
                mediaIds.push(...mediaDocs);
                logger.info('Product update: Images saved to Media model', { productId: id, mediaCount: mediaDocs.length });
            } catch (mediaError) {
                logger.error('Error saving images to Media model during update', { error: mediaError.message, productId: id });
                // Continue even if Media save fails (backward compatibility)
            }
        }

        await productModel.findByIdAndUpdate(id, updatePayload);
        logger.info('Product updated successfully', { productId: id });
        res.json({ success: true, message: "Product updated successfully" });
    } catch (error) {
        logger.error('Error updating product', { error: error.message, stack: error.stack, productId: id });
        res.json({ success: false, message: error.message });
    }
}

// List product
const listProducts = async (req, res) => {
    try {
        const { inStockOnly = false } = req.query; // Optional filter for stock availability
        
        let products;
        if (inStockOnly === 'true') {
            // Only return products with stock > 0
            products = await productModel.find({ stock: { $gt: 0 } });
        } else {
            products = await productModel.find({});
        }
        
        res.json({success: true, products});
    } catch (error) {
        logger.error('Error listing products', { error: error.message, stack: error.stack });
        res.json({success: false, message: error.message});
    }
}

// Remove product
const removeProduct = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }
        const { id } = req.body;
        await productModel.findByIdAndDelete(id);
        logger.info('Product removed successfully', { productId: id });
        res.json({success: true, message: "Product removed successfully"});
    } catch (error) {
        logger.error('Error removing product', { error: error.message, stack: error.stack, productId: req.body.id });
        res.json({success: false, message: error.message});
    }
}

// Single product info
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await productModel.findById(productId);
        if (!product) {
            return res.json({success: false, message: "Product not found"});
        }
        res.json({success: true, product});
    } catch (error) {
        logger.error('Error fetching single product', { error: error.message, stack: error.stack, productId: req.body.productId });
        res.json({success: false, message: error.message});
    }
}

export { listProducts, addProduct, removeProduct, singleProduct, updateProduct };
