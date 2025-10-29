import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { assets } from "../assets/assets.js";
import { backendUrl } from "../App.jsx";
import { toast } from "react-toastify";

const Edit = ({ token }) => {
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
                    setStock(product.stock ?? "");
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
                console.log(error);
                toast.error(error.message);
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
            console.log(error);
            toast.error(error.message);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Ürün bilgileri yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Ürünü Düzenle</h1>
                <p className="text-gray-600 mt-2">Ürün bilgilerini güncelleyin</p>
            </div>

            <form onSubmit={onSubmitHandler} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Temel Bilgiler</h3>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ürün Adı *
                        </label>
                        <input
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                            placeholder="Örn: Antep Fıstıklı Baklava"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ürün Açıklaması *
                        </label>
                        <textarea
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={4}
                            placeholder="Ürünün özelliklerini, lezzetini ve kullanımını açıklayın..."
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Kategori *
                            </label>
                            <select
                                onChange={(e) => setCategory(e.target.value)}
                                value={category}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Fiyat (₺) *
                            </label>
                            <input
                                onChange={(e) => setPrice(e.target.value)}
                                value={price}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                type="number"
                                step="0.01"
                                placeholder="99.99"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Stok *
                            </label>
                            <input
                                onChange={(e) => setStock(e.target.value)}
                                value={stock}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                        className="w-5 h-5"
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                        Öne Çıkan Ürün ⭐
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-6"></div>
                {/* Size & Person Count Selection */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Boyut ve Miktar</h3>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
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
                                            ? "bg-pink-100 border-pink-500 text-pink-700"
                                            : "bg-gray-50 border-gray-300 text-gray-700 hover:border-pink-300"
                                    }`}
                                >
                                    {size}gr
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
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
                                            ? "bg-blue-100 border-blue-500 text-blue-700"
                                            : "bg-gray-50 border-gray-300 text-gray-700 hover:border-blue-300"
                                    }`}
                                >
                                    {count}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-6"></div>

                {/* Product Details Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Ürün Detayları</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Alerjen Bilgileri
                            </label>
                            <input
                                type="text"
                                value={allergens}
                                onChange={(e) => setAllergens(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Örn: Antep fıstığı, gluten, süt ürünleri"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Taze/Kuru
                            </label>
                            <select
                                value={freshType}
                                onChange={(e) => setFreshType(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="taze">Taze</option>
                                <option value="kuru">Kuru</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Malzemeler
                        </label>
                        <textarea
                            value={ingredients}
                            onChange={(e) => setIngredients(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={2}
                            placeholder="Örn: Fıstık, şeker, yumurta, tereyağı, un"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Raf Ömrü / Tazeleme
                            </label>
                            <input
                                type="text"
                                value={shelfLife}
                                onChange={(e) => setShelfLife(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Örn: 5 gün taze"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ambalaj
                            </label>
                            <select
                                value={packaging}
                                onChange={(e) => setPackaging(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="standart">Standart</option>
                                <option value="özel">Özel Ambalaj</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Saklama Koşulları
                        </label>
                        <input
                            type="text"
                            value={storageInfo}
                            onChange={(e) => setStorageInfo(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Örn: Kuru ve serin yerde saklayın"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={giftWrap}
                            onChange={(e) => setGiftWrap(e.target.checked)}
                            id="giftWrap"
                            className="w-5 h-5"
                        />
                        <label htmlFor="giftWrap" className="text-sm font-medium text-gray-700 cursor-pointer">
                            Hediye Paketi Seçeneği 🎁
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
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
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Etiket yazıp Enter'a basın"
                            />
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {labels.map((label, idx) => (
                                <span 
                                    key={idx} 
                                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm"
                                >
                                    {label}
                                    <button 
                                        type="button" 
                                        onClick={() => setLabels(labels.filter((_, i) => i !== idx))} 
                                        className="ml-2 hover:font-bold"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Image Upload Section - Moved to Bottom */}
                <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Görseller (Opsiyonel)</h3>
                    <div className="grid grid-cols-4 gap-3">
                        {[0, 1, 2, 3].map((index) => (
                            <div key={index} className="relative">
                                <label 
                                    htmlFor={`image${index + 1}`}
                                    className="block cursor-pointer"
                                >
                                    <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors overflow-hidden">
                                        <img
                                            className="w-full h-full object-cover"
                                            src={previewUrls[index]}
                                            alt=""
                                        />
                                    </div>
                                    {!imageStates[index] && !existingImages[index] && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <span className="text-2xl">📷</span>
                                        </div>
                                    )}
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
                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        💡 İpucu: Değiştirmek istediğiniz görseli seçin, mevcut görseller korunur.
                    </p>
                </div>

                {/* Submit Button */}
                <div className="border-t border-gray-200 pt-6 flex gap-4">
                    <button 
                        type="submit" 
                        className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                    >
                        ✅ Değişiklikleri Kaydet
                    </button>
                    <button 
                        type="button" 
                        onClick={() => navigate("/list")}
                        className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                    >
                        ❌ İptal
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Edit;
