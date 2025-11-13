import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { assets } from "../assets/assets.js";
import { backendUrl } from "../App.jsx";
import { toast } from "react-toastify";
import { useTheme } from '../context/ThemeContext.jsx';
import MediaGallery from "../components/MediaGallery.jsx";
import { ChevronDown, ChevronUp, Image as ImageIcon, Gift, Info, Save, X } from "lucide-react";

const Edit = ({ token }) => {
    const { isDarkMode } = useTheme();
    const { id } = useParams();
    const navigate = useNavigate();

    const [image1, setImage1] = useState(null);
    const [image2, setImage2] = useState(null);
    const [image3, setImage3] = useState(null);
    const [image4, setImage4] = useState(null);
    const imageStates = [image1, image2, image3, image4];
    const imageSetters = [setImage1, setImage2, setImage3, setImage4];

    const [existingImages, setExistingImages] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([assets.upload_area, assets.upload_area, assets.upload_area, assets.upload_area]);
    
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
    
    const [loading, setLoading] = useState(true);

    const availableSizes = [250, 500, 1000, 2000]; // Gramajlar: 250gr, 500gr, 1kg, 2kg
    const availablePersonCounts = ["2-3 Kişilik", "5-6 Kişilik", "8-10 Kişilik", "12+ Kişilik"];

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.post(backendUrl + "/api/product/single", { productId: id });
                if (response.data.success) {
                    const product = response.data.product;
                    setName(product.name);
                    setDescription(product.description);
                    setPrice(product.basePrice);
                    setCategory(product.category);
                    setSubCategory(product.subCategory || "");
                    setBestseller(Boolean(product.bestseller));
                    setSizes((product.sizes || []).map((item) => Number(item)));
                    setPersonCounts(product.personCounts || []);
                    setAllergens(product.allergens || "");
                    setIngredients(product.ingredients || "");
                    setShelfLife(product.shelfLife || "");
                    setStorageInfo(product.storageInfo || "");
                    setWeights(product.weights || []);
                    setFreshType(product.freshType || "taze");
                    setPackaging(product.packaging || "standart");
                    setGiftWrap(product.giftWrap || false);
                    setLabels(product.labels || []);
                    setExistingImages(product.image || []);
                    setSelectedMediaUrls(product.image || []); // Initialize with existing images
                    setStock(product.stock ?? "");
                    setShowAllergenInfo(!!product.allergens); // Show if allergens exist
                    setShowProductDetails(!!(product.ingredients || product.shelfLife || product.storageInfo || product.giftWrap || (product.labels && product.labels.length > 0))); // Show if any product details exist
                    setPreviewUrls([
                        product.image?.[0] || assets.upload_area,
                        product.image?.[1] || assets.upload_area,
                        product.image?.[2] || assets.upload_area,
                        product.image?.[3] || assets.upload_area,
                    ]);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Ürün bilgileri yüklenirken hata oluştu');
        } finally {
            setLoading(false);
        }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    useEffect(() => {
        const objectUrls = imageStates.map((file) => (file ? URL.createObjectURL(file) : null));
        setPreviewUrls(objectUrls.map((url, index) => url || existingImages[index] || assets.upload_area));

        return () => {
            objectUrls.forEach((url) => {
                if (url) {
                    URL.revokeObjectURL(url);
                }
            });
        };
    }, [image1, image2, image3, image4, existingImages]);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("id", id);
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

            imageStates.forEach((file, index) => {
                if (file) {
                    formData.append(`image${index + 1}`, file);
                }
            });

            const response = await axios.post(backendUrl + "/api/product/update", formData, { headers: { token } });
            if (response.data.success) {
                toast.success(response.data.message);
                setImage1(null);
                setImage2(null);
                setImage3(null);
                setImage4(null);
                navigate("/list");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Ürün güncellenirken hata oluştu');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600 dark:border-primary-800 dark:border-t-primary-400"></div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Ürün bilgileri yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ürünü Düzenle</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Ürün bilgilerini güncelleyin</p>
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
                                    value={category}
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
                                {availablePersonCounts.map((count) => (
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
                                        } else {
                                            setSelectedMediaUrls(existingImages);
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
                                    {[0, 1, 2, 3].map((index) => (
                                        <div key={index} className="relative group">
                                            <label 
                                                htmlFor={`image${index + 1}`}
                                                className="block cursor-pointer"
                                            >
                                                <div className="w-16 h-16 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 dark:hover:border-primary-400 transition-all overflow-hidden bg-gray-50 dark:bg-gray-700 group-hover:scale-105">
                                                    {(imageStates[index] || existingImages[index]) ? (
                                                        <img
                                                            className="w-full h-full object-cover"
                                                            src={imageStates[index] 
                                                                ? URL.createObjectURL(imageStates[index])
                                                                : (existingImages[index]?.startsWith('http') 
                                                                    ? existingImages[index] 
                                                                    : `${backendUrl}${existingImages[index]}`)
                                                            }
                                                            alt={`Görsel ${index + 1}`}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <ImageIcon className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                                                        </div>
                                                    )}
                                                </div>
                                            </label>
                                            <input
                                                onChange={(e) => imageSetters[index](e.target.files[0])}
                                                type="file"
                                                id={`image${index + 1}`}
                                                accept="image/*"
                                                hidden
                                            />
                                            {(imageStates[index] || existingImages[index]) && (
                                                <button
                                                    type="button"
                                                    onClick={() => imageSetters[index](null)}
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
                                        Değiştirmek istediğiniz görseli seçin, mevcut görseller korunur.
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
                            <span>Değişiklikleri Kaydet</span>
                        </button>
                        <button 
                            type="button" 
                            onClick={() => navigate("/list")}
                            className="btn-secondary flex items-center gap-2"
                        >
                            <X className="w-4 h-4" />
                            <span>İptal</span>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Edit;
