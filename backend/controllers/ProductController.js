//import { v2 as cloudinary } from 'cloudinary';
import productModel from "../models/ProductModel.js";


const parseSizes = (sizes) => {
    if (!sizes) return [];
    if (Array.isArray(sizes)) return sizes;
    return [sizes];
}

const addProduct = async (req, res) => {
    try {
        const { name, description, basePrice, category, subCategory, sizes, personCounts, bestseller, stock, allergens, ingredients, shelfLife, storageInfo, weights, freshType, packaging, giftWrap, labels } = req.body;
        
        const parsePersonCounts = (personCounts) => {
            if (!personCounts) return [];
            if (Array.isArray(personCounts)) return personCounts;
            if (typeof personCounts === 'string') return personCounts.split(',').map(p => p.trim());
            return [];
        };
        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        //upload images with multer
        const imagesUrl = images.map(item => `/assets/${item.filename}`)

        /* upload images to cloudinary
        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, {resource_type: 'image'});
                return result.secure_url;
            })
        )
        */

        console.log(name, description, basePrice, category, subCategory, sizes, bestseller);
        console.log(imagesUrl);

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
        console.log(productData);

        const product = new productModel(productData);
        await product.save();

        res.json({success: true, message: "Product added successfully"});

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message});
    }
}

    const updateProduct = async (req, res) => {
    try {
        const { id, name, description, basePrice, category, subCategory, sizes, personCounts, bestseller, stock, allergens, ingredients, shelfLife, storageInfo, weights, freshType, packaging, giftWrap, labels } = req.body;

        const parsePersonCounts = (personCounts) => {
            if (!personCounts) return [];
            if (Array.isArray(personCounts)) return personCounts;
            if (typeof personCounts === 'string') return personCounts.split(',').map(p => p.trim());
            return [];
        };

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
        }

        await productModel.findByIdAndUpdate(id, updatePayload);
        res.json({ success: true, message: "Product updated successfully" });
    } catch (error) {
        console.log(error);
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
        console.log(error);
        res.json({success: false, message: error.message});
    }
}

// Remove product
const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id);
        res.json({success: true, message: "Product removed successfully"});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message});
    }
}

// Single product info
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await productModel.findById(productId);
        res.json({success: true, product});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message});
    }
}

export { listProducts, addProduct, removeProduct, singleProduct, updateProduct };
