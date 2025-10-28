import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    basePrice: {type: Number, required: true},
    image: {type: Array, required: true},
    category: {type: String, required: true},
    subCategory: {type: String},
    sizes: {type: Array, required: true}, // Gramaj: 250, 500, 1000, 2000
    weights: {type: [Number], default: []},
    freshType: {type: String, enum: ['taze','kuru'], default: 'taze'},
    packaging: {type: String, enum: ['standart','özel'], default: 'standart'},
    giftWrap: {type: Boolean, default: false},
    labels: {type: [String], default: []},
    personCounts: {type: Array, required: true}, // Kişi sayısı: 2-3, 5-6, 8-10, 12+
    bestseller: {type: Boolean},
    date: {type: Number, required: true},
    sizePrices: [{ size: Number, price: Number }], // Gramaja özel fiyat
    stock: {type: Number, default: 0},
    allergens: {type: String}, // Alerjen bilgileri
    ingredients: {type: String}, // Malzemeler
    shelfLife: {type: String}, // Raf ömrü/tazeleme bilgisi
    storageInfo: {type: String} // Saklama koşulları
})

// Performance indexes
productSchema.index({ category: 1, subCategory: 1 });
productSchema.index({ bestseller: 1 });
productSchema.index({ stock: 1 });
productSchema.index({ basePrice: 1 });
productSchema.index({ date: -1 });
productSchema.index({ 'sizePrices.price': 1 });

const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
