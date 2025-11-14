import productModel from "../models/ProductModel.js";
import Media from "../models/MediaModel.js";
import logger from "../utils/logger.js";

// Helper function to parse JSON string or return array
const parseJSONArray = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [parsed];
        } catch (e) {
            // Not JSON, try comma-separated
            return value.split(',').map(v => v.trim()).filter(v => v);
        }
    }
    return [value];
};

const parseSizes = (sizes) => {
    const parsed = parseJSONArray(sizes);
    return parsed.map(s => Number(s)).filter(s => !isNaN(s));
}

const addProduct = async (req, res) => {
    try {
        const { name, description, basePrice, category, subCategory, sizes, personCounts, bestseller, stock, allergens, ingredients, shelfLife, storageInfo, weights, freshType, packaging, giftWrap, labels, metaTitle, metaDescription, keywords } = req.body;
        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        // Upload images with multer (saved to backend/uploads, served via /uploads)
        const imagesUrl = images.map(item => `/uploads/${item.filename}`);

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
                            url: `/uploads/${file.filename}`,
                            secureUrl: `${baseUrl}/uploads/${file.filename}`,
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
        const parsedWeights = parseJSONArray(weights).map(w => Number(w)).filter(w => !isNaN(w));
        const parsedLabels = parseJSONArray(labels);
        const parsedPersonCounts = parseJSONArray(personCounts);

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
            personCounts: parsedPersonCounts,
            image: imagesUrl,
            date: Date.now(),
            sizePrices,
            stock: Number(stock ?? 0),
            allergens: allergens || "",
            ingredients: ingredients || "",
            shelfLife: shelfLife || "",
            storageInfo: storageInfo || "",
            // SEO Fields (will be auto-generated if not provided)
            metaTitle: metaTitle || undefined,
            metaDescription: metaDescription || undefined,
            keywords: keywords ? parseJSONArray(keywords) : undefined
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
        const { id, name, description, basePrice, category, subCategory, sizes, personCounts, bestseller, stock, allergens, ingredients, shelfLife, storageInfo, weights, freshType, packaging, giftWrap, labels, metaTitle, metaDescription, keywords } = req.body;

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
        if (personCounts !== undefined) updatePayload.personCounts = parseJSONArray(personCounts);
        if (allergens !== undefined) updatePayload.allergens = allergens;
        if (ingredients !== undefined) updatePayload.ingredients = ingredients;
        if (shelfLife !== undefined) updatePayload.shelfLife = shelfLife;
        if (storageInfo !== undefined) updatePayload.storageInfo = storageInfo;
        if (weights !== undefined) {
            updatePayload.weights = parseJSONArray(weights).map(w => Number(w)).filter(w => !isNaN(w));
        }
        if (freshType !== undefined) updatePayload.freshType = freshType === 'kuru' ? 'kuru' : 'taze';
        if (packaging !== undefined) updatePayload.packaging = packaging === 'özel' ? 'özel' : 'standart';
        if (giftWrap !== undefined) updatePayload.giftWrap = giftWrap === 'true' || giftWrap === true;
        if (labels !== undefined) updatePayload.labels = parseJSONArray(labels);

        // SEO Fields
        if (metaTitle !== undefined) updatePayload.metaTitle = metaTitle;
        if (metaDescription !== undefined) updatePayload.metaDescription = metaDescription;
        if (keywords !== undefined) updatePayload.keywords = parseJSONArray(keywords);

        const parsedSizes = parseSizes(sizes);
        if (parsedSizes.length) {
            updatePayload.sizes = parsedSizes;
            updatePayload.sizePrices = parsedSizes.map(size => ({
                size,
                price: Number(basePrice) * size
            }));
        }

        if (images.length) {
            const imagesUrl = images.map(item => `/uploads/${item.filename}`);
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
                            url: `/uploads/${file.filename}`,
                            secureUrl: `${baseUrl}/uploads/${file.filename}`,
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
        const { inStockOnly = false, includeDeleted = false } = req.query;

        let query = {};

        // Default: only show active products (including those without 'active' field for backward compatibility)
        if (includeDeleted !== 'true') {
            query.active = { $ne: false }; // Not equal to false (includes true and undefined/null)
        }

        // Optional stock filter
        if (inStockOnly === 'true') {
            query.stock = { $gt: 0 };
        }

        const products = await productModel.find(query).populate('category', 'name slug active').sort({ date: -1 });
        res.json({success: true, products});
    } catch (error) {
        logger.error('Error listing products', { error: error.message, stack: error.stack });
        res.json({success: false, message: error.message});
    }
}

// Remove product
const removeProduct = async (req, res) => {
    try {
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
        const product = await productModel.findById(productId).populate('category', 'name slug active');
        if (!product) {
            return res.json({success: false, message: "Product not found"});
        }
        res.json({success: true, product});
    } catch (error) {
        logger.error('Error fetching single product', { error: error.message, stack: error.stack, productId: req.body.productId });
        res.json({success: false, message: error.message});
    }
}

// Get product by SKU
const getProductBySKU = async (req, res) => {
    try {
        const { sku } = req.params;
        const product = await productModel.findOne({ sku: sku.toUpperCase() }).populate('category', 'name slug active');

        if (!product) {
            return res.json({success: false, message: `Ürün bulunamadı: ${sku}`});
        }

        logger.info('Product fetched by SKU', { sku });
        res.json({success: true, product});
    } catch (error) {
        logger.error('Error fetching product by SKU', { error: error.message, stack: error.stack, sku: req.params.sku });
        res.json({success: false, message: error.message});
    }
}

// Get product by Barcode
const getProductByBarcode = async (req, res) => {
    try {
        const { barcode } = req.params;
        const product = await productModel.findOne({ barcode }).populate('category', 'name slug active');

        if (!product) {
            return res.json({success: false, message: `Barkod bulunamadı: ${barcode}`});
        }

        logger.info('Product fetched by barcode', { barcode });
        res.json({success: true, product});
    } catch (error) {
        logger.error('Error fetching product by barcode', { error: error.message, stack: error.stack, barcode: req.params.barcode });
        res.json({success: false, message: error.message});
    }
}

// Soft Delete - Set active: false
const softDeleteProduct = async (req, res) => {
    try {
        const { id } = req.body;
        const adminId = req.userId || 'system'; // From auth middleware

        const product = await productModel.findByIdAndUpdate(
            id,
            {
                active: false,
                deletedAt: new Date(),
                deletedBy: adminId
            },
            { new: true }
        );

        if (!product) {
            return res.json({ success: false, message: "Ürün bulunamadı" });
        }

        logger.info('Product soft deleted', { productId: id, adminId });
        res.json({ success: true, message: "Ürün pasife alındı" });
    } catch (error) {
        logger.error('Error soft deleting product', { error: error.message, stack: error.stack, productId: req.body.id });
        res.json({ success: false, message: error.message });
    }
};

// Restore Deleted Product
const restoreProduct = async (req, res) => {
    try {
        const { id } = req.body;

        const product = await productModel.findByIdAndUpdate(
            id,
            {
                active: true,
                deletedAt: null,
                deletedBy: null
            },
            { new: true }
        );

        if (!product) {
            return res.json({ success: false, message: "Ürün bulunamadı" });
        }

        logger.info('Product restored', { productId: id });
        res.json({ success: true, message: "Ürün geri yüklendi" });
    } catch (error) {
        logger.error('Error restoring product', { error: error.message, stack: error.stack, productId: req.body.id });
        res.json({ success: false, message: error.message });
    }
};

// Permanent Delete - Used by cleanup job and admin
const permanentDeleteProduct = async (req, res) => {
    try {
        const { id } = req.body;

        // Get product first to delete associated media
        const product = await productModel.findById(id);

        if (!product) {
            return res.json({ success: false, message: "Ürün bulunamadı" });
        }

        // Delete associated media files from Media model
        if (product.image && product.image.length > 0) {
            try {
                await Media.deleteMany({
                    'usedIn.type': 'product',
                    'usedIn.id': id
                });
                logger.info('Media files deleted for product', { productId: id, imageCount: product.image.length });
            } catch (mediaError) {
                logger.error('Error deleting media files', { error: mediaError.message, productId: id });
                // Continue with product deletion even if media deletion fails
            }
        }

        // Permanent delete from database
        await productModel.findByIdAndDelete(id);

        logger.info('Product permanently deleted', { productId: id, productName: product.name });
        res.json({ success: true, message: "Ürün kalıcı olarak silindi" });
    } catch (error) {
        logger.error('Error permanently deleting product', { error: error.message, stack: error.stack, productId: req.body.id });
        res.json({ success: false, message: error.message });
    }
};

// Quick update single field (for inline editing)
const quickUpdateProduct = async (req, res) => {
    try {
        const { id, field, value } = req.body;

        if (!id || !field) {
            return res.json({ success: false, message: "ID ve alan adı gereklidir" });
        }

        // Whitelist of allowed fields for quick update
        const allowedFields = ['stock', 'basePrice', 'category', 'bestseller', 'active'];

        if (!allowedFields.includes(field)) {
            return res.json({ success: false, message: "Bu alan hızlı güncellenemez" });
        }

        const updateData = { [field]: value };

        const product = await productModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.json({ success: false, message: "Ürün bulunamadı" });
        }

        logger.info('Product quick updated', { productId: id, field, value });
        res.json({ success: true, message: "Ürün güncellendi", product });
    } catch (error) {
        logger.error('Error quick updating product', { error: error.message, stack: error.stack, productId: req.body.id });
        res.json({ success: false, message: error.message });
    }
};

// Get price range for filter slider
const getPriceRange = async (req, res) => {
    try {
        const products = await productModel.find({ active: true });

        if (products.length === 0) {
            return res.json({ success: true, minPrice: 0, maxPrice: 10000 });
        }

        // Get all prices from basePrice and sizePrices
        const allPrices = [];
        products.forEach(product => {
            allPrices.push(product.basePrice);
            if (product.sizePrices && product.sizePrices.length > 0) {
                product.sizePrices.forEach(sp => allPrices.push(sp.price));
            }
        });

        const minPrice = Math.floor(Math.min(...allPrices) / 100); // Convert from kuruş to TL
        const maxPrice = Math.ceil(Math.max(...allPrices) / 100);

        res.json({ success: true, minPrice, maxPrice });
    } catch (error) {
        logger.error('Error getting price range', { error: error.message, stack: error.stack });
        res.status(500).json({ success: false, message: error.message });
    }
};

export {
    listProducts,
    addProduct,
    removeProduct,
    singleProduct,
    updateProduct,
    softDeleteProduct,
    restoreProduct,
    permanentDeleteProduct,
    quickUpdateProduct,
    getProductBySKU,
    getProductByBarcode,
    getPriceRange
};
