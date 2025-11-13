import "dotenv/config";
import connectDB from "../config/mongodb.js";
import productModel from "../models/ProductModel.js";
import categoryModel from "../models/CategoryModel.js";
import logger from "../utils/logger.js";

// Default products for Tulumbak
const DEFAULT_PRODUCTS = [
    // ========== TULUMBALAR ==========
    {
        name: "Tulumba Tatlısı",
        description: "Geleneksel tulumba tatlısı, hafif ve tatlı şerbetli",
        category: "Tulumbalar",
        basePrice: 120,
        sizes: [500, 1000, 1500, 2000],
        weights: [500, 1000, 1500, 2000],
        personCounts: ["1-2", "3-4", "5-6", "8-10"],
        labels: [],
        bestseller: true,
        stock: 100,
        freshType: "taze",
        packaging: "standart",
        date: Date.now(),
        giftWrap: true,
        ingredients: "Un, şeker, su, kabartma tozu, nişasta",
        allergens: "Gluten",
        shelfLife: "3 gün",
        storageInfo: "Oda sıcaklığında muhafaza edilmelidir"
    },
    {
        name: "Kaymaklı Tulumba",
        description: "Kaymak dolgulu özel tulumba tatlısı",
        category: "Tulumbalar",
        basePrice: 220,
        sizes: [500, 1000, 1500, 2000],
        weights: [500, 1000, 1500, 2000],
        personCounts: ["1-2", "3-4", "5-6", "8-10"],
        labels: ["Öne Çıkan"],
        bestseller: false,
        stock: 50,
        freshType: "taze",
        packaging: "standart",
        date: Date.now(),
        giftWrap: true,
        ingredients: "Un, şeker, kaymak, su, kabartma tozu",
        allergens: "Gluten, Süt",
        shelfLife: "2 gün",
        storageInfo: "Serin yerde muhafaza edilmelidir"
    },
    {
        name: "Tahinli Fıstıklı Tulumba",
        description: "Tahin dolgulu, üzeri fıstık kaplı tulumba",
        category: "Tulumbalar",
        basePrice: 220,
        sizes: [500, 1000, 1500, 2000],
        weights: [500, 1000, 1500, 2000],
        personCounts: ["1-2", "3-4", "5-6", "8-10"],
        labels: ["Yeni"],
        bestseller: false,
        stock: 40,
        freshType: "taze",
        packaging: "standart",
        date: Date.now(),
        giftWrap: true,
        ingredients: "Un, şeker, tahin, Antep fıstığı, su",
        allergens: "Gluten, Susam, Sert Kabuklu Yemiş",
        shelfLife: "3 gün",
        storageInfo: "Oda sıcaklığında muhafaza edilmelidir"
    },
    {
        name: "Karışık Dolgulu Tulumba",
        description: "Çikolata, fıstık ve kaymak dolgulu karışık tulumba",
        category: "Tulumbalar",
        basePrice: 220,
        sizes: [500, 1000, 1500, 2000],
        weights: [500, 1000, 1500, 2000],
        personCounts: ["1-2", "3-4", "5-6", "8-10"],
        labels: [],
        bestseller: true,
        stock: 60,
        freshType: "taze",
        packaging: "standart",
        date: Date.now(),
        giftWrap: true,
        ingredients: "Un, şeker, çikolata, fıstık, kaymak, su",
        allergens: "Gluten, Süt, Sert Kabuklu Yemiş",
        shelfLife: "2 gün",
        storageInfo: "Serin yerde muhafaza edilmelidir"
    },
    {
        name: "Lotuslu Tulumba Tatlısı",
        description: "Lotus dolgulu ve lotus kırığı kaplı özel tulumba",
        category: "Tulumbalar",
        basePrice: 220,
        sizes: [500, 1000, 1500, 2000],
        weights: [500, 1000, 1500, 2000],
        personCounts: ["1-2", "3-4", "5-6", "8-10"],
        labels: ["Yeni", "Öne Çıkan"],
        bestseller: true,
        stock: 30,
        freshType: "taze",
        packaging: "standart",
        date: Date.now(),
        giftWrap: true,
        ingredients: "Un, şeker, Lotus bisküvisi, karamel, su",
        allergens: "Gluten, Süt",
        shelfLife: "3 gün",
        storageInfo: "Oda sıcaklığında muhafaza edilmelidir"
    },

    // ========== SÜTLÜ TATILAR ==========
    {
        name: "Soğuk Baklava (Cevizli)",
        description: "Cevizli soğuk baklava, sütlü ve hafif",
        category: "Sütlü Tatlılar",
        basePrice: 290,
        sizes: [500, 1000, 1500, 2000],
        weights: [500, 1000, 1500, 2000],
        personCounts: ["2-3", "4-5", "6-8", "10-12"],
        labels: [],
        bestseller: true,
        stock: 50,
        freshType: "taze",
        packaging: "standart",
        date: Date.now(),
        giftWrap: true,
        ingredients: "Yufka, ceviz, süt, şeker, tereyağı",
        allergens: "Gluten, Süt, Sert Kabuklu Yemiş",
        shelfLife: "2 gün",
        storageInfo: "Buzdolabında muhafaza edilmelidir"
    },
    {
        name: "Soğuk Baklava (Fıstıklı)",
        description: "Antep fıstıklı soğuk baklava, premium lezzet",
        category: "Sütlü Tatlılar",
        basePrice: 390,
        sizes: [500, 1000, 1500, 2000],
        weights: [500, 1000, 1500, 2000],
        personCounts: ["2-3", "4-5", "6-8", "10-12"],
        labels: ["Öne Çıkan"],
        bestseller: true,
        stock: 40,
        freshType: "taze",
        packaging: "standart",
        date: Date.now(),
        giftWrap: true,
        ingredients: "Yufka, Antep fıstığı, süt, şeker, tereyağı",
        allergens: "Gluten, Süt, Sert Kabuklu Yemiş",
        shelfLife: "2 gün",
        storageInfo: "Buzdolabında muhafaza edilmelidir"
    },
    {
        name: "Sade Maraş Dondurma",
        description: "Geleneksel sade Maraş dondurması",
        category: "Sütlü Tatlılar",
        basePrice: 150,
        sizes: [250, 500, 1000, 1500],
        weights: [250, 500, 1000, 1500],
        personCounts: ["1-2", "3-4", "6-8", "10-12"],
        labels: [],
        bestseller: true,
        stock: 100,
        freshType: "taze",
        packaging: "özel",
        date: Date.now(),
        giftWrap: false,
        ingredients: "Süt, şeker, salep, sakız",
        allergens: "Süt",
        shelfLife: "30 gün",
        storageInfo: "Dondurucuda muhafaza edilmelidir"
    },
    {
        name: "Karışık Maraş Dondurma",
        description: "Sade, çikolatalı, çilekli ve limonlu karışık dondurma",
        category: "Sütlü Tatlılar",
        basePrice: 150,
        sizes: [250, 500, 1000, 1500],
        weights: [250, 500, 1000, 1500],
        personCounts: ["1-2", "3-4", "6-8", "10-12"],
        labels: ["Öne Çıkan"],
        bestseller: true,
        stock: 80,
        freshType: "taze",
        packaging: "özel",
        date: Date.now(),
        giftWrap: false,
        ingredients: "Süt, şeker, salep, sakız, kakao, meyve aroması",
        allergens: "Süt",
        shelfLife: "30 gün",
        storageInfo: "Dondurucuda muhafaza edilmelidir"
    },
    {
        name: "Sade & Çikolatalı Maraş Dondurma",
        description: "İki lezzet bir arada: sade ve çikolatalı",
        category: "Sütlü Tatlılar",
        basePrice: 150,
        sizes: [500, 1000, 1500],
        weights: [500, 1000, 1500],
        personCounts: ["2-3", "4-6", "8-10"],
        labels: [],
        bestseller: false,
        stock: 60,
        freshType: "taze",
        packaging: "özel",
        date: Date.now(),
        giftWrap: false,
        ingredients: "Süt, şeker, salep, sakız, kakao",
        allergens: "Süt",
        shelfLife: "30 gün",
        storageInfo: "Dondurucuda muhafaza edilmelidir"
    },

    // ========== ŞERBETLİ TATILAR ==========
    {
        name: "Cevizli Özel Baklava",
        description: "Küçük dilim, bol cevizli özel baklava",
        category: "Şerbetli Tatlılar",
        basePrice: 250,
        sizes: [500, 1000, 1500, 2000],
        weights: [500, 1000, 1500, 2000],
        personCounts: ["2-3", "4-6", "8-10", "12+"],
        labels: [],
        bestseller: true,
        stock: 100,
        freshType: "taze",
        packaging: "standart",
        date: Date.now(),
        giftWrap: true,
        ingredients: "Yufka, ceviz, şeker, tereyağı, su",
        allergens: "Gluten, Süt, Sert Kabuklu Yemiş",
        shelfLife: "7 gün",
        storageInfo: "Oda sıcaklığında muhafaza edilmelidir"
    },
    {
        name: "Fıstıklı Kaymaklı Midye Baklava",
        description: "Antep fıstığı ve kaymak dolgulu midye baklava",
        category: "Şerbetli Tatlılar",
        basePrice: 390,
        sizes: [500, 1000, 1500, 2000],
        weights: [500, 1000, 1500, 2000],
        personCounts: ["2-3", "4-6", "8-10", "12+"],
        labels: ["Öne Çıkan"],
        bestseller: true,
        stock: 50,
        freshType: "taze",
        packaging: "standart",
        date: Date.now(),
        giftWrap: true,
        ingredients: "Yufka, Antep fıstığı, kaymak, şeker, tereyağı",
        allergens: "Gluten, Süt, Sert Kabuklu Yemiş",
        shelfLife: "5 gün",
        storageInfo: "Serin yerde muhafaza edilmelidir"
    },
    {
        name: "Cevizli Klasik Baklava",
        description: "Geleneksel cevizli baklava, tek kişilik",
        category: "Şerbetli Tatlılar",
        basePrice: 250,
        sizes: [500, 1000, 1500, 2000],
        weights: [500, 1000, 1500, 2000],
        personCounts: ["2-3", "4-6", "8-10", "12+"],
        labels: [],
        bestseller: true,
        stock: 120,
        freshType: "taze",
        packaging: "standart",
        date: Date.now(),
        giftWrap: true,
        ingredients: "Yufka, ceviz, şeker, tereyağı, su",
        allergens: "Gluten, Süt, Sert Kabuklu Yemiş",
        shelfLife: "7 gün",
        storageInfo: "Oda sıcaklığında muhafaza edilmelidir"
    },
    {
        name: "Diyarbakır Burma Kadayıf (Cevizli)",
        description: "Bol cevizli Diyarbakır usulü burma kadayıf",
        category: "Şerbetli Tatlılar",
        basePrice: 200,
        sizes: [500, 1000, 1500, 2000],
        weights: [500, 1000, 1500, 2000],
        personCounts: ["2-3", "4-6", "8-10", "12+"],
        labels: ["Yeni"],
        bestseller: false,
        stock: 60,
        freshType: "taze",
        packaging: "standart",
        date: Date.now(),
        giftWrap: true,
        ingredients: "Kadayıf, ceviz, şeker, tereyağı, su",
        allergens: "Gluten, Süt, Sert Kabuklu Yemiş",
        shelfLife: "5 gün",
        storageInfo: "Oda sıcaklığında muhafaza edilmelidir"
    },
    {
        name: "Kalburabastı Tatlısı (Cevizli)",
        description: "İçi cevizli geleneksel kalburabastı",
        category: "Şerbetli Tatlılar",
        basePrice: 190,
        sizes: [500, 1000, 1500],
        weights: [500, 1000, 1500],
        personCounts: ["2-3", "4-6", "8-10"],
        labels: [],
        bestseller: false,
        stock: 50,
        freshType: "taze",
        packaging: "standart",
        date: Date.now(),
        giftWrap: true,
        ingredients: "Un, irmik, ceviz, şeker, tereyağı",
        allergens: "Gluten, Süt, Sert Kabuklu Yemiş",
        shelfLife: "10 gün",
        storageInfo: "Oda sıcaklığında muhafaza edilmelidir"
    },
    {
        name: "Lor Tatlısı",
        description: "Lor peyniri dolgulu özel tatlı",
        category: "Şerbetli Tatlılar",
        basePrice: 190,
        sizes: [500, 1000, 1500],
        weights: [500, 1000, 1500],
        personCounts: ["2-3", "4-6", "8-10"],
        labels: [],
        bestseller: false,
        stock: 40,
        freshType: "taze",
        packaging: "standart",
        date: Date.now(),
        giftWrap: true,
        ingredients: "Yufka, lor peyniri, şeker, tereyağı",
        allergens: "Gluten, Süt",
        shelfLife: "3 gün",
        storageInfo: "Buzdolabında muhafaza edilmelidir"
    },
    {
        name: "Cevizli Halep Tatlısı",
        description: "Hindistan cevizi kaplı cevizli Halep tatlısı",
        category: "Şerbetli Tatlılar",
        basePrice: 320,
        sizes: [500, 1000, 1500, 2000],
        weights: [500, 1000, 1500, 2000],
        personCounts: ["2-3", "4-6", "8-10", "12+"],
        labels: ["Öne Çıkan"],
        bestseller: true,
        stock: 50,
        freshType: "taze",
        packaging: "standart",
        date: Date.now(),
        giftWrap: true,
        ingredients: "İrmik, ceviz, hindistan cevizi, şeker, tereyağı",
        allergens: "Süt, Sert Kabuklu Yemiş",
        shelfLife: "7 gün",
        storageInfo: "Oda sıcaklığında muhafaza edilmelidir"
    },
    {
        name: "Cevizli Sütlü Nuriye",
        description: "Sütlü ve cevizli klasik Nuriye tatlısı",
        category: "Şerbetli Tatlılar",
        basePrice: 250,
        sizes: [500, 1000, 1500, 2000],
        weights: [500, 1000, 1500, 2000],
        personCounts: ["2-3", "4-6", "8-10", "12+"],
        labels: [],
        bestseller: false,
        stock: 60,
        freshType: "taze",
        packaging: "standart",
        date: Date.now(),
        giftWrap: true,
        ingredients: "Yufka, ceviz, süt, şeker, tereyağı",
        allergens: "Gluten, Süt, Sert Kabuklu Yemiş",
        shelfLife: "5 gün",
        storageInfo: "Buzdolabında muhafaza edilmelidir"
    },
    {
        name: "Kaymaklı Şambali Tatlısı",
        description: "Kaymak ile servis edilen şambali",
        category: "Şerbetli Tatlılar",
        basePrice: 70,
        sizes: [1, 3, 6, 12],
        weights: [100, 300, 600, 1200],
        personCounts: ["1", "3", "6", "12"],
        labels: [],
        bestseller: false,
        stock: 100,
        freshType: "taze",
        packaging: "standart",
        date: Date.now(),
        giftWrap: false,
        ingredients: "İrmik, yoğurt, kaymak, şeker, tereyağı",
        allergens: "Süt, Gluten",
        shelfLife: "3 gün",
        storageInfo: "Serin yerde muhafaza edilmelidir"
    },
    {
        name: "Cevizli Kadayıf",
        description: "Ceviz dolgulu geleneksel kadayıf",
        category: "Şerbetli Tatlılar",
        basePrice: 250,
        sizes: [500, 1000, 1500, 2000],
        weights: [500, 1000, 1500, 2000],
        personCounts: ["2-3", "4-6", "8-10", "12+"],
        labels: [],
        bestseller: true,
        stock: 80,
        freshType: "taze",
        packaging: "standart",
        date: Date.now(),
        giftWrap: true,
        ingredients: "Kadayıf, ceviz, şeker, tereyağı, su",
        allergens: "Gluten, Süt, Sert Kabuklu Yemiş",
        shelfLife: "5 gün",
        storageInfo: "Oda sıcaklığında muhafaza edilmelidir"
    },
    {
        name: "Şekerpare Tatlısı",
        description: "Klasik lezzet şekerpare",
        category: "Şerbetli Tatlılar",
        basePrice: 190,
        sizes: [500, 1000, 1500],
        weights: [500, 1000, 1500],
        personCounts: ["3-4", "6-8", "10-12"],
        labels: [],
        bestseller: false,
        stock: 90,
        freshType: "taze",
        packaging: "standart",
        date: Date.now(),
        giftWrap: true,
        ingredients: "Un, irmik, şeker, tereyağı, badem",
        allergens: "Gluten, Süt, Sert Kabuklu Yemiş",
        shelfLife: "10 gün",
        storageInfo: "Oda sıcaklığında muhafaza edilmelidir"
    },
    {
        name: "Bal Badem Tatlısı",
        description: "Haşhaş, tarçın, badem ve bal ile hazırlanan özel tatlı",
        category: "Şerbetli Tatlılar",
        basePrice: 190,
        sizes: [500, 1000, 1500],
        weights: [500, 1000, 1500],
        personCounts: ["2-3", "4-6", "8-10"],
        labels: ["Yeni"],
        bestseller: false,
        stock: 40,
        freshType: "taze",
        packaging: "standart",
        date: Date.now(),
        giftWrap: true,
        ingredients: "Badem, bal, haşhaş, tarçın, un, tereyağı",
        allergens: "Gluten, Süt, Sert Kabuklu Yemiş",
        shelfLife: "7 gün",
        storageInfo: "Oda sıcaklığında muhafaza edilmelidir"
    },
    {
        name: "Şambali Tatlısı",
        description: "Geleneksel şambali, adet olarak servis edilmektedir",
        category: "Şerbetli Tatlılar",
        basePrice: 50,
        sizes: [1, 3, 6, 12, 24],
        weights: [80, 240, 480, 960, 1920],
        personCounts: ["1", "3", "6", "12", "24"],
        labels: [],
        bestseller: true,
        stock: 150,
        freshType: "taze",
        packaging: "standart",
        date: Date.now(),
        giftWrap: false,
        ingredients: "İrmik, yoğurt, şeker, tereyağı",
        allergens: "Süt, Gluten",
        shelfLife: "5 gün",
        storageInfo: "Oda sıcaklığında muhafaza edilmelidir"
    },
    {
        name: "Cevizli Ev Baklavası",
        description: "Ev usulü cevizli baklava, tek kişilik",
        category: "Şerbetli Tatlılar",
        basePrice: 250,
        sizes: [500, 1000, 1500, 2000],
        weights: [500, 1000, 1500, 2000],
        personCounts: ["2-3", "4-6", "8-10", "12+"],
        labels: [],
        bestseller: true,
        stock: 100,
        freshType: "taze",
        packaging: "standart",
        date: Date.now(),
        giftWrap: true,
        ingredients: "Yufka, ceviz, şeker, tereyağı, su",
        allergens: "Gluten, Süt, Sert Kabuklu Yemiş",
        shelfLife: "7 gün",
        storageInfo: "Oda sıcaklığında muhafaza edilmelidir"
    },
    {
        name: "Fıstıklı Kuru Baklava",
        description: "Antep fıstıklı kuru baklava, şerbetli tatlı",
        category: "Şerbetli Tatlılar",
        basePrice: 390,
        sizes: [500, 1000, 1500, 2000],
        weights: [500, 1000, 1500, 2000],
        personCounts: ["2-3", "4-6", "8-10", "12+"],
        labels: ["Öne Çıkan"],
        bestseller: true,
        stock: 60,
        freshType: "taze",
        packaging: "standart",
        date: Date.now(),
        giftWrap: true,
        ingredients: "Yufka, Antep fıstığı, şeker, tereyağı, su",
        allergens: "Gluten, Süt, Sert Kabuklu Yemiş",
        shelfLife: "10 gün",
        storageInfo: "Oda sıcaklığında muhafaza edilmelidir"
    },
    {
        name: "Fıstıklı Havuç Dilim Baklava",
        description: "Bol Antep fıstıklı havuç dilim baklava",
        category: "Şerbetli Tatlılar",
        basePrice: 250,
        sizes: [500, 1000, 1500, 2000],
        weights: [500, 1000, 1500, 2000],
        personCounts: ["2-3", "4-6", "8-10", "12+"],
        labels: [],
        bestseller: false,
        stock: 70,
        freshType: "taze",
        packaging: "standart",
        date: Date.now(),
        giftWrap: true,
        ingredients: "Yufka, Antep fıstığı, şeker, tereyağı, su",
        allergens: "Gluten, Süt, Sert Kabuklu Yemiş",
        shelfLife: "7 gün",
        storageInfo: "Oda sıcaklığında muhafaza edilmelidir"
    },
    {
        name: "Ekmek Kadayıfı (Kaymaklı)",
        description: "Bol kaymaklı ekmek kadayıfı",
        category: "Şerbetli Tatlılar",
        basePrice: 220,
        sizes: [500, 1000, 1500, 2000],
        weights: [500, 1000, 1500, 2000],
        personCounts: ["2-3", "4-6", "8-10", "12+"],
        labels: [],
        bestseller: true,
        stock: 80,
        freshType: "taze",
        packaging: "standart",
        date: Date.now(),
        giftWrap: true,
        ingredients: "Ekmek, kaymak, şeker, süt, tereyağı",
        allergens: "Gluten, Süt",
        shelfLife: "2 gün",
        storageInfo: "Buzdolabında muhafaza edilmelidir"
    },
    {
        name: "Tahinli Kaymaklı Şambali (Fıstıklı)",
        description: "Kaymak, tahin ve fıstık ile özel şambali",
        category: "Şerbetli Tatlılar",
        basePrice: 80,
        sizes: [1, 3, 6, 12],
        weights: [100, 300, 600, 1200],
        personCounts: ["1", "3", "6", "12"],
        labels: ["Yeni"],
        bestseller: false,
        stock: 60,
        freshType: "taze",
        packaging: "standart",
        date: Date.now(),
        giftWrap: false,
        ingredients: "İrmik, yoğurt, kaymak, tahin, Antep fıstığı, şeker",
        allergens: "Süt, Gluten, Susam, Sert Kabuklu Yemiş",
        shelfLife: "3 gün",
        storageInfo: "Serin yerde muhafaza edilmelidir"
    },
    {
        name: "Kaymaklı Cevizli Halep Tatlısı",
        description: "Kaymaklı ve hindistan cevizi kaplı Halep",
        category: "Şerbetli Tatlılar",
        basePrice: 350,
        sizes: [500, 1000, 1500, 2000],
        weights: [500, 1000, 1500, 2000],
        personCounts: ["2-3", "4-6", "8-10", "12+"],
        labels: ["Öne Çıkan"],
        bestseller: true,
        stock: 50,
        freshType: "taze",
        packaging: "standart",
        date: Date.now(),
        giftWrap: true,
        ingredients: "İrmik, ceviz, kaymak, hindistan cevizi, şeker",
        allergens: "Süt, Sert Kabuklu Yemiş",
        shelfLife: "5 gün",
        storageInfo: "Buzdolabında muhafaza edilmelidir"
    },
    {
        name: "Kaymaklı Tahinli Hayrabolu Tatlısı",
        description: "Kaymak, tahin ve fıstık ile özel Hayrabolu",
        category: "Şerbetli Tatlılar",
        basePrice: 100,
        sizes: [1, 3, 6, 12],
        weights: [120, 360, 720, 1440],
        personCounts: ["1", "3", "6", "12"],
        labels: ["Yeni"],
        bestseller: false,
        stock: 50,
        freshType: "taze",
        packaging: "standart",
        date: Date.now(),
        giftWrap: false,
        ingredients: "Un, kaymak, tahin, Antep fıstığı, şeker, tereyağı",
        allergens: "Gluten, Süt, Susam, Sert Kabuklu Yemiş",
        shelfLife: "5 gün",
        storageInfo: "Serin yerde muhafaza edilmelidir"
    },
    {
        name: "Fıstık Sarma",
        description: "Premium Antep fıstıklı fıstık sarma, paket olarak servis",
        category: "Şerbetli Tatlılar",
        basePrice: 590,
        sizes: [500, 1000, 1500, 2000],
        weights: [500, 1000, 1500, 2000],
        personCounts: ["3-4", "6-8", "10-12", "15+"],
        labels: ["Öne Çıkan", "Sınırlı Üretim"],
        bestseller: true,
        stock: 30,
        freshType: "taze",
        packaging: "standart",
        date: Date.now(),
        giftWrap: true,
        ingredients: "Yufka, Antep fıstığı, şeker, tereyağı, su",
        allergens: "Gluten, Süt, Sert Kabuklu Yemiş",
        shelfLife: "10 gün",
        storageInfo: "Oda sıcaklığında muhafaza edilmelidir"
    }
];

const seedProducts = async () => {
    try {
        console.log('🌱 Starting product seeding...');

        // Connect to MongoDB
        await connectDB();

        // Check if products already exist
        const existingCount = await productModel.countDocuments();

        if (existingCount > 0) {
            console.log(`⚠️  ${existingCount} products already exist in database`);
            console.log('Do you want to:');
            console.log('1. Skip seeding (keep existing)');
            console.log('2. Add only missing products');
            console.log('3. Clear and re-seed all products (⚠️  DESTRUCTIVE)');

            // For automated seeding, default to option 2 (add missing only)
            const option = process.argv[2] || '2';

            if (option === '1') {
                console.log('✅ Skipping seed - keeping existing products');
                process.exit(0);
            } else if (option === '3') {
                console.log('🗑️  Clearing existing products...');
                await productModel.deleteMany({});
                console.log('✅ Existing products cleared');
            }
        }

        // Verify categories exist
        const categories = await categoryModel.find();
        if (categories.length === 0) {
            console.error('❌ No categories found. Please run seedCategories.js first');
            process.exit(1);
        }

        console.log(`✅ Found ${categories.length} categories`);

        // Insert or update default products
        let addedCount = 0;
        let updatedCount = 0;
        let skippedCount = 0;

        for (const productData of DEFAULT_PRODUCTS) {
            // Verify category exists
            const category = await categoryModel.findOne({ name: productData.category });

            if (!category) {
                console.log(`⚠️  Skipped: ${productData.name} (Category "${productData.category}" not found)`);
                skippedCount++;
                continue;
            }

            const existing = await productModel.findOne({
                name: { $regex: new RegExp(`^${productData.name}$`, 'i') }
            });

            if (existing) {
                // Update if exists
                await productModel.findByIdAndUpdate(existing._id, productData);
                updatedCount++;
                console.log(`✏️  Updated: ${productData.name}`);
            } else {
                // Create if doesn't exist
                const product = new productModel(productData);
                await product.save();
                addedCount++;
                console.log(`✅ Added: ${productData.name} (${productData.category})`);
            }
        }

        // Update category product counts
        console.log('\n🔄 Updating category product counts...');
        for (const category of categories) {
            await category.updateProductCount();
        }

        console.log('\n✨ Product seeding completed!');
        console.log(`📊 Summary:`);
        console.log(`   - Added: ${addedCount} products`);
        console.log(`   - Updated: ${updatedCount} products`);
        console.log(`   - Skipped: ${skippedCount} products`);
        console.log(`   - Total: ${await productModel.countDocuments()} products in database`);

        // List products by category
        console.log('\n📋 Products by category:');
        for (const category of categories) {
            const count = await productModel.countDocuments({ category: category.name });
            console.log(`   ${category.name}: ${count} products`);
        }

        logger.info('Products seeded successfully', {
            added: addedCount,
            updated: updatedCount,
            skipped: skippedCount,
            total: await productModel.countDocuments()
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding products:', error);
        logger.error('Product seeding failed', { error: error.message, stack: error.stack });
        process.exit(1);
    }
};

// Run seed if this script is executed directly
const isMain = import.meta.url.endsWith('seedProducts.js');
if (isMain) {
    seedProducts();
}

export default seedProducts;
