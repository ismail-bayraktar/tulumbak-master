import mongoose from "mongoose";

// Keyword array limit validator
const arrayLimit = (val) => val.length <= 10;

const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    basePrice: {type: Number, required: true},
    image: {type: Array, required: true},
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
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
    storageInfo: {type: String}, // Saklama koşulları

    // SEO Fields
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        sparse: true // Allow null during creation, will be auto-generated
    },
    metaTitle: {
        type: String,
        trim: true,
        maxlength: [60, 'Meta title en fazla 60 karakter olabilir']
    },
    metaDescription: {
        type: String,
        trim: true,
        maxlength: [160, 'Meta description en fazla 160 karakter olabilir']
    },
    keywords: {
        type: [String],
        default: [],
        validate: [arrayLimit, 'Maksimum 10 keyword eklenebilir']
    },

    // Soft Delete Fields
    active: {
        type: Boolean,
        default: true,
        index: true
    },
    deletedAt: {
        type: Date,
        default: null
    },
    deletedBy: {
        type: String,
        default: null
    }
}, {timestamps: true})

// Performance indexes
productSchema.index({ category: 1, subCategory: 1 });
productSchema.index({ bestseller: 1 });
productSchema.index({ stock: 1 });
productSchema.index({ basePrice: 1 });
productSchema.index({ date: -1 });
productSchema.index({ 'sizePrices.price': 1 });
productSchema.index({ active: 1, date: -1 }); // For filtering active products
// Note: slug index is automatically created by unique: true in schema

// Auto-generate SEO fields before save
productSchema.pre('save', function(next) {
    // Auto-generate slug from name
    if (this.isModified('name') || !this.slug) {
        // Turkish character replacement
        const turkishMap = {
            'ç': 'c', 'Ç': 'C',
            'ğ': 'g', 'Ğ': 'G',
            'ı': 'i', 'İ': 'I',
            'ö': 'o', 'Ö': 'O',
            'ş': 's', 'Ş': 'S',
            'ü': 'u', 'Ü': 'U'
        };

        let slug = this.name.toLowerCase();

        // Replace Turkish characters
        Object.keys(turkishMap).forEach(key => {
            slug = slug.replace(new RegExp(key, 'g'), turkishMap[key]);
        });

        // Replace spaces and special chars with dash
        slug = slug
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

        this.slug = slug;
    }

    // Auto-generate metaTitle if not provided
    if ((this.isModified('name') || this.isModified('category')) && !this.metaTitle) {
        let title = `${this.name} | ${this.category} - Tulumbak`;
        if (title.length > 60) {
            title = title.substring(0, 57) + '...';
        }
        this.metaTitle = title;
    }

    // Auto-generate metaDescription if not provided
    if ((this.isModified('description') || this.isModified('category')) && !this.metaDescription) {
        let desc = this.description;
        if (desc.length > 160) {
            desc = desc.substring(0, 157) + '...';
        }
        this.metaDescription = desc;
    }

    // Auto-generate keywords if not provided or empty
    if ((this.isModified('name') || this.isModified('category')) && (!this.keywords || this.keywords.length === 0)) {
        const nameWords = this.name.toLowerCase().split(' ').filter(w => w.length > 2);
        const categoryWords = this.category.toLowerCase().split(' ').filter(w => w.length > 2);
        const allWords = [...new Set([...nameWords, ...categoryWords])];
        this.keywords = allWords.slice(0, 10);
    }

    next();
});

const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
