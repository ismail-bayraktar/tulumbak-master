import { assets } from "../assets/assets.js";
import { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App.jsx";
import { toast } from "react-toastify";
import { useTheme } from '../context/ThemeContext.jsx';
import MediaGallery from "../components/MediaGallery.jsx";
import { ChevronDown, ChevronUp, Image as ImageIcon, Gift, Info, Save, X } from "lucide-react";

const Add = ({ token }) => {
    const { isDarkMode } = useTheme();
    const [image1, setImage1] = useState(false);
    const [image2, setImage2] = useState(false);
    const [image3, setImage3] = useState(false);
    const [image4, setImage4] = useState(false);
    
    // Media Gallery selection
    const [selectedMediaUrls, setSelectedMediaUrls] = useState([]);
    const [useMediaGallery, setUseMediaGallery] = useState(false);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [subCategory, setSubCategory] = useState("");
    const [bestseller, setBestseller] = useState(false);
    const [sizes, setSizes] = useState([]);
    const [personCounts, setPersonCounts] = useState([]);
    const [stock, setStock] = useState("");
    const [sizePrices, setSizePrices] = useState([]);
    const [allergens, setAllergens] = useState("");
    const [ingredients, setIngredients] = useState("");
    const [shelfLife, setShelfLife] = useState("");
    const [storageInfo, setStorageInfo] = useState("");
    
    // Yeni alanlar
    const [weights, setWeights] = useState([]);
    const [freshType, setFreshType] = useState("taze");
    const [packaging, setPackaging] = useState("standart");
    const [giftWrap, setGiftWrap] = useState(false);
    const [labels, setLabels] = useState([]);
    const [labelInput, setLabelInput] = useState("");
    const [showAllergenInfo, setShowAllergenInfo] = useState(false);
    const [showProductDetails, setShowProductDetails] = useState(false);

    const availableSizes = [250, 500, 1000, 2000]; // Gramajlar: 250gr, 500gr, 1kg, 2kg

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", description);
            formData.append("basePrice", price);
            formData.append("category", category);
            formData.append("subCategory", subCategory);
            formData.append("bestseller", bestseller);
            formData.append("stock", stock || 0);
            sizes.forEach((size) => formData.append("sizes", size));
            personCounts.forEach((count) => formData.append("personCounts", count));
            formData.append("allergens", allergens);
            formData.append("ingredients", ingredients);
            formData.append("shelfLife", shelfLife);
            formData.append("storageInfo", storageInfo);
            
            // Yeni alanlar
            weights.forEach((w) => formData.append("weights", w));
            formData.append("freshType", freshType);
            formData.append("packaging", packaging);
            formData.append("giftWrap", giftWrap);
            labels.forEach((label) => formData.append("labels", label));

            image1 && formData.append("image1", image1);
            image2 && formData.append("image2", image2);
            image3 && formData.append("image3", image3);
            image4 && formData.append("image4", image4);

            const response = await axios.post(backendUrl + "/api/product/add", formData, { headers: { token } });

            if (response.data.success) {
                toast.success(response.data.message);
                setName("");
                setDescription("");
                setImage1(false);
                setImage2(false);
                setImage3(false);
                setImage4(false);
                setPrice("");
                setSizes([]);
                setStock("");
                setAllergens("");
                setIngredients("");
                setShelfLife("");
                setStorageInfo("");
                setWeights([]);
                setFreshType("taze");
                setPackaging("standart");
                setGiftWrap(false);
                setLabels([]);
                setPersonCounts([]);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Ürün eklenirken hata oluştu');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ürün Ekle</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Yeni ürün ekleyin ve yönetin</p>
            </div>

            <form onSubmit={onSubmitHandler} className="card dark:bg-gray-800 dark:border-gray-700 space-y-6">
                <div className="card-body">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Temel Bilgiler</h3>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Ürün Adı *
                            </label>
                            <input
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                                type="text"
                                placeholder="Örn: Antep Fıstıklı Baklava"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Ürün Açıklaması *
                            </label>
                            <textarea
                                onChange={(e) => setDescription(e.target.value)}
                                value={description}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                                rows={4}
                                placeholder="Ürünün özelliklerini, lezzetini ve kullanımını açıklayın..."
                                required
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Kategori *
                                </label>
                                <select
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                                    required
                                >
                                    <option value="">Seçiniz</option>
                                    <option value="Baklava">Baklava</option>
                                    <option value="Kadayıf">Kadayıf</option>
                                    <option value="Sütlü Tatlı">Sütlü Tatlı</option>
                                    <option value="Kuru Tatlı">Kuru Tatlı</option>
                                    <option value="Möğürlü Tatlı">Möğürlü Tatlı</option>
                                    <option value="Şerbetli Tatlı">Şerbetli Tatlı</option>
                                    <option value="Özel Paket">Özel Paket</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Fiyat (₺) *
                                </label>
                                <input
                                    onChange={(e) => setPrice(e.target.value)}
                                    value={price}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                                    type="number"
                                    step="0.01"
                                    placeholder="99.99"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Stok *
                                </label>
                                <input
                                    onChange={(e) => setStock(e.target.value)}
                                    value={stock}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                                    type="number"
                                    min={0}
                                    placeholder="10"
                                    required
                                />
                            </div>

                            <div className="flex items-end">
                                <div className="w-full">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={bestseller}
                                            onChange={() => setBestseller((prev) => !prev)}
                                            className="w-5 h-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                                        />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Öne Çıkan Ürün
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6"></div>
                    {/* Size & Person Count Selection */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Boyut ve Miktar</h3>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Gramaj (Gram)
                            </label>
                            <div className="flex gap-3 flex-wrap">
                                {availableSizes.map((size) => (
                                    <button
                                        key={size}
                                        type="button"
                                        onClick={() =>
                                            setSizes((prev) =>
                                                prev.includes(size)
                                                    ? prev.filter((item) => item !== size)
                                                    : [...prev, size]
                                            )
                                        }
                                        className={`px-4 py-2 rounded-lg border-2 transition-all ${
                                            sizes.includes(size)
                                                ? "bg-primary-100 dark:bg-primary-900/30 border-primary-500 dark:border-primary-600 text-primary-700 dark:text-primary-300"
                                                : "bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary-300 dark:hover:border-primary-500"
                                        }`}
                                    >
                                        {size}gr
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Kişi Sayısı
                            </label>
                            <div className="flex gap-3 flex-wrap">
                                {["2-3 Kişilik", "5-6 Kişilik", "8-10 Kişilik", "12+ Kişilik"].map((count) => (
                                    <button
                                        key={count}
                                        type="button"
                                        onClick={() =>
                                            setPersonCounts((prev) =>
                                                prev.includes(count)
                                                    ? prev.filter((item) => item !== count)
                                                    : [...prev, count]
                                            )
                                        }
                                        className={`px-4 py-2 rounded-lg border-2 transition-all ${
                                            personCounts.includes(count)
                                                ? "bg-primary-100 dark:bg-primary-900/30 border-primary-500 dark:border-primary-600 text-primary-700 dark:text-primary-300"
                                                : "bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary-300 dark:hover:border-primary-500"
                                        }`}
                                    >
                                        {count}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Alerjen Bilgileri - Separate Collapsible */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                            <button
                                type="button"
                                onClick={() => setShowAllergenInfo(!showAllergenInfo)}
                                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={showAllergenInfo}
                                        onChange={() => setShowAllergenInfo(!showAllergenInfo)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Alerjen Bilgileri Ekle
                                    </span>
                                </div>
                                {showAllergenInfo ? (
                                    <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                )}
                            </button>
                            {showAllergenInfo && (
                                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Alerjen Bilgileri
                                    </label>
                                    <input
                                        type="text"
                                        value={allergens}
                                        onChange={(e) => setAllergens(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Örn: Antep fıstığı, gluten, süt ürünleri"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Product Details Section - Collapsible */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                            <button
                                type="button"
                                onClick={() => setShowProductDetails(!showProductDetails)}
                                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={showProductDetails}
                                        onChange={() => setShowProductDetails(!showProductDetails)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Ürün Detayları Ekle
                                    </span>
                                </div>
                                {showProductDetails ? (
                                    <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                )}
                            </button>
                            {showProductDetails && (
                                <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Taze/Kuru
                                            </label>
                                            <select
                                                value={freshType}
                                                onChange={(e) => setFreshType(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                                            >
                                                <option value="taze">Taze</option>
                                                <option value="kuru">Kuru</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Ambalaj
                                            </label>
                                            <select
                                                value={packaging}
                                                onChange={(e) => setPackaging(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                                            >
                                                <option value="standart">Standart</option>
                                                <option value="özel">Özel Ambalaj</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Malzemeler
                                        </label>
                                        <textarea
                                            value={ingredients}
                                            onChange={(e) => setIngredients(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                                            rows={2}
                                            placeholder="Örn: Fıstık, şeker, yumurta, tereyağı, un"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Raf Ömrü / Tazeleme
                                            </label>
                                            <input
                                                type="text"
                                                value={shelfLife}
                                                onChange={(e) => setShelfLife(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                                                placeholder="Örn: 5 gün taze"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Saklama Koşulları
                                            </label>
                                            <input
                                                type="text"
                                                value={storageInfo}
                                                onChange={(e) => setStorageInfo(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                                                placeholder="Örn: Kuru ve serin yerde saklayın"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={giftWrap}
                                            onChange={(e) => setGiftWrap(e.target.checked)}
                                            id="giftWrap"
                                            className="w-5 h-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                                        />
                                        <label htmlFor="giftWrap" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                                            <Gift className="w-4 h-4" />
                                            <span>Hediye Paketi Seçeneği</span>
                                        </label>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Etiketler (örn: Hemen Yenir, Servis Gerektirir)
                                        </label>
                                        <div className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                value={labelInput}
                                                onChange={(e) => setLabelInput(e.target.value)}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        if (labelInput.trim() && !labels.includes(labelInput.trim())) {
                                                            setLabels([...labels, labelInput.trim()]);
                                                            setLabelInput("");
                                                        }
                                                    }
                                                }}
                                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                                                placeholder="Etiket yazıp Enter'a basın"
                                            />
                                        </div>
                                        <div className="flex gap-2 flex-wrap">
                                            {labels.map((label, idx) => (
                                                <span 
                                                    key={idx} 
                                                    className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 rounded-lg text-sm"
                                                >
                                                    {label}
                                                    <button 
                                                        type="button" 
                                                        onClick={() => setLabels(labels.filter((_, i) => i !== idx))} 
                                                        className="ml-2 hover:font-bold text-primary-900 dark:text-primary-200"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Image Upload Section - Moved to Bottom */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Görseller (Opsiyonel)</h3>
                        
                        {/* Media Gallery Toggle */}
                        <div className="mb-4 flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={useMediaGallery}
                                    onChange={(e) => {
                                        setUseMediaGallery(e.target.checked);
                                        if (!e.target.checked) {
                                            setSelectedMediaUrls([]);
                                        }
                                    }}
                                    className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                    Medya Kütüphanesinden Seç
                                </span>
                            </label>
                        </div>

                        {/* Media Gallery */}
                        {useMediaGallery ? (
                            <MediaGallery
                                token={token}
                                onSelect={(urls) => {
                                    const urlArray = Array.isArray(urls) ? urls : [urls].filter(Boolean);
                                    setSelectedMediaUrls(urlArray);
                                }}
                                selectedMedia={selectedMediaUrls}
                                maxFiles={4}
                                category="product"
                                multiple={true}
                            />
                        ) : (
                            <>
                                {/* File Inputs (Backward Compatibility) - Minimal Design */}
                                <div className="flex gap-3 flex-wrap">
                                    {[1, 2, 3, 4].map((num) => (
                                        <div key={num} className="relative group">
                                            <label 
                                                htmlFor={`image${num}`}
                                                className="block cursor-pointer"
                                            >
                                                <div className="w-16 h-16 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 dark:hover:border-primary-400 transition-all overflow-hidden bg-gray-50 dark:bg-gray-700 group-hover:scale-105">
                                                    {eval(`image${num}`) ? (
                                                        <img
                                                            className="w-full h-full object-cover"
                                                            src={URL.createObjectURL(eval(`image${num}`))}
                                                            alt={`Görsel ${num}`}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <ImageIcon className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                                                        </div>
                                                    )}
                                                </div>
                                            </label>
                                            <input
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    eval(`setImage${num}(file)`);
                                                }}
                                                type="file"
                                                id={`image${num}`}
                                                accept="image/*"
                                                hidden
                                            />
                                            {eval(`image${num}`) && (
                                                <button
                                                    type="button"
                                                    onClick={() => eval(`setImage${num}(false)`)}
                                                    className="absolute -top-1 -right-1 bg-danger-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-danger-600 shadow-lg"
                                                    title="Kaldır"
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-start gap-2 mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                                    <p className="text-xs text-blue-700 dark:text-blue-300">
                                        Ana görsel yüklemek yeterlidir, ekstra görseller ürün detaylarında kullanılır.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex gap-3">
                        <button 
                            type="submit" 
                            className="btn-primary flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            <span>Ürünü Ekle</span>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Add;
