import { assets } from "../assets/assets.js";
import { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App.jsx";
import { toast } from "react-toastify";

const Add = ({ token }) => {
    const [image1, setImage1] = useState(false);
    const [image2, setImage2] = useState(false);
    const [image3, setImage3] = useState(false);
    const [image4, setImage4] = useState(false);

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
            console.log(error);
            toast.error(error.message);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Ürün Ekle</h1>
                <p className="text-gray-600 mt-2">Yeni ürün ekleyin ve yönetin</p>
            </div>

            <form onSubmit={onSubmitHandler} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
                {/* Image Upload Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Görsel Yükleme</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((num) => (
                            <div key={num} className="relative">
                                <label 
                                    htmlFor={`image${num}`}
                                    className="block cursor-pointer"
                                >
                                    <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors overflow-hidden">
                                        <img
                                            className="w-full h-full object-cover"
                                            src={
                                                !eval(`image${num}`) 
                                                    ? assets.upload_area 
                                                    : URL.createObjectURL(eval(`image${num}`))
                                            }
                                            alt=""
                                        />
                                    </div>
                                    {!eval(`image${num}`) && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center">
                                                <span className="text-4xl">📷</span>
                                                <p className="text-xs text-gray-500 mt-1">Görsel {num}</p>
                                            </div>
                                        </div>
                                    )}
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
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <p className="text-sm text-gray-500">
                        Ana görsel ve ürün detayları için en az 1 görsel yükleyin
                    </p>
                </div>

                <div className="border-t border-gray-200 pt-6"></div>
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

            {/* Baklava Özel Alanlar */}
            <div className="w-full">
                <p className="mb-2">Alerjen Bilgileri</p>
                <input
                    type="text"
                    value={allergens}
                    onChange={(e) => setAllergens(e.target.value)}
                    className="w-full px-3 py-2"
                    placeholder="Örn: Antep fıstığı, gluten, süt ürünleri"
                />
            </div>

            <div className="w-full">
                <p className="mb-2">Malzemeler</p>
                <textarea
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    className="w-full px-3 py-2"
                    rows={2}
                    placeholder="Örn: Fıstık, şeker, yumurta, tereyağı, un"
                />
            </div>

            <div className="w-full">
                <p className="mb-2">Raf Ömrü / Tazeleme</p>
                <input
                    type="text"
                    value={shelfLife}
                    onChange={(e) => setShelfLife(e.target.value)}
                    className="w-full px-3 py-2"
                    placeholder="Örn: 5 gün taze, oda sıcaklığında 10 gün"
                />
            </div>

            <div className="w-full">
                <p className="mb-2">Saklama Koşulları</p>
                <input
                    type="text"
                    value={storageInfo}
                    onChange={(e) => setStorageInfo(e.target.value)}
                    className="w-full px-3 py-2"
                    placeholder="Örn: Kuru ve serin yerde saklayın, buzdolabılır"
                />
            </div>

            {/* YENİ ALANLAR */}
            <div className="w-full">
                <p className="mb-2">Taze/Kuru</p>
                <select
                    value={freshType}
                    onChange={(e) => setFreshType(e.target.value)}
                    className="w-full px-3 py-2"
                >
                    <option value="taze">Taze</option>
                    <option value="kuru">Kuru</option>
                </select>
            </div>

            <div className="w-full">
                <p className="mb-2">Ambalaj</p>
                <select
                    value={packaging}
                    onChange={(e) => setPackaging(e.target.value)}
                    className="w-full px-3 py-2"
                >
                    <option value="standart">Standart</option>
                    <option value="özel">Özel Ambalaj</option>
                </select>
            </div>

            <div className="flex gap-2">
                <input
                    type="checkbox"
                    checked={giftWrap}
                    onChange={(e) => setGiftWrap(e.target.checked)}
                    id="giftWrap"
                />
                <label htmlFor="giftWrap" className="cursor-pointer">Hediye Paketi Seçeneği</label>
            </div>

            <div className="w-full">
                <p className="mb-2">Etiketler (örn: Hemen Yenir, Servis Gerektirir)</p>
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
                        className="flex-1 px-3 py-2"
                        placeholder="Etiket yazıp Enter'a basın"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {labels.map((label, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gray-200 rounded">
                            {label}
                            <button type="button" onClick={() => setLabels(labels.filter((_, i) => i !== idx))} className="ml-2">×</button>
                        </span>
                    ))}
                </div>
            </div>
            
            <div className={"flex gap-2 mt-2"}>
                <input
                    onChange={() => setBestseller((prev) => !prev)}
                    checked={bestseller}
                    type={"checkbox"}
                    id={"bestseller"}
                />
                <label className={"cursor-pointer"} htmlFor={"bestseller"}>
                    Ürünü Öne Çıkar
                </label>
            </div>
            <button type={"submit"} className={"w-28 py-3 mt-4 bg-black text-white"}>
                EKLE
            </button>
        </form>
    );
};

export default Add;
