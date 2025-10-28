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
        return <p>Ürün bilgileri yükleniyor...</p>;
    }

    return (
        <form onSubmit={onSubmitHandler} className={"flex flex-col w-full items-start gap-3"}>
            <div>
                <p className={"mb-2"}>Görsel Yükle</p>
                <div className={"flex gap-2"}>
                    {[0, 1, 2, 3].map((index) => (
                        <label htmlFor={`image${index + 1}`} key={index}>
                            <img
                                className={"w-20 h-20 object-cover"}
                                src={previewUrls[index]}
                                alt=""
                            />
                            <input
                                onChange={(e) => imageSetters[index](e.target.files[0])}
                                type={"file"}
                                id={`image${index + 1}`}
                                hidden
                            />
                        </label>
                    ))}
                </div>
            </div>
            <div className={"w-full"}>
                <p className={"mb-2"}>Ürün Adı</p>
                <input
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    className={"w-full max-w-[500px] px-3 py-2"}
                    type={"text"}
                    placeholder={"Type here"}
                    required
                />
            </div>
            <div className={"w-full"}>
                <p className={"mb-2"}>Ürün Açıklaması</p>
                <textarea
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    className={"w-full max-w-[500px] px-3 py-2"}
                    type={"text"}
                    placeholder={"Write content here"}
                    required
                />
            </div>
            <div className={"flex flex-col sm:flex-row gap-2 w-full sm:gap-8"}>
                <div>
                    <p className={"mb-2"}>Ürün Kategorisi</p>
                    <select
                        onChange={(e) => setCategory(e.target.value)}
                        className={"w-full px-3 py-2"}
                        value={category}
                    >
                        <option value=""></option>
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
                    <p className={"mb-2"}>Ürün Fiyatı</p>
                    <input
                        onChange={(e) => setPrice(e.target.value)}
                        value={price}
                        className={"w-full px-3 py-2 sm:w-[120px]"}
                        type={"number"}
                        placeholder={"35"}
                        required
                    />
                </div>
                <div>
                    <p className={"mb-2"}>Stok Miktarı</p>
                    <input
                        onChange={(e) => setStock(e.target.value)}
                        value={stock}
                        className={"w-full px-3 py-2 sm:w-[120px]"}
                        type={"number"}
                        min={0}
                        placeholder={"10"}
                        required
                    />
                </div>
            </div>
            
            {/* Kişi Sayısı Seçimi */}
            <div>
                <p className={"mb-2"}>Kişi Sayısı</p>
                <div className={"flex gap-3 flex-wrap"}>
                    {availablePersonCounts.map((count) => (
                        <div
                            key={count}
                            onClick={() =>
                                setPersonCounts((prev) =>
                                    prev.includes(count)
                                        ? prev.filter((item) => item !== count)
                                        : [...prev, count]
                                )
                            }
                        >
                            <p
                                className={`${
                                    personCounts.includes(count) ? "bg-pink-100" : "bg-slate-200"
                                } px-3 py-1 cursor-pointer`}
                            >
                                {count}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Gramaj Seçimi */}
            <div>
                <p className={"mb-2"}>Gramaj (Gram)</p>
                <div className={"flex gap-3 flex-wrap"}>
                    {availableSizes.map((sizeValue) => (
                        <div
                            key={sizeValue}
                            onClick={() =>
                                setSizes((prev) =>
                                    prev.includes(sizeValue)
                                        ? prev.filter((item) => item !== sizeValue)
                                        : [...prev, sizeValue]
                                )
                            }
                        >
                            <p
                                className={`${
                                    sizes.includes(sizeValue) ? "bg-pink-100" : "bg-slate-200"
                                } px-3 py-1 cursor-pointer`}
                            >
                                {sizeValue}gr
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Baklava Özel Alanlar */}
            <div className={"w-full"}>
                <p className={"mb-2"}>Alerjen Bilgileri</p>
                <input
                    type="text"
                    value={allergens}
                    onChange={(e) => setAllergens(e.target.value)}
                    className="w-full px-3 py-2"
                    placeholder="Örn: Antep fıstığı, gluten, süt ürünleri"
                />
            </div>

            <div className={"w-full"}>
                <p className={"mb-2"}>Malzemeler</p>
                <textarea
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    className="w-full px-3 py-2"
                    rows={2}
                    placeholder="Örn: Fıstık, şeker, yumurta, tereyağı, un"
                />
            </div>

            <div className={"w-full"}>
                <p className={"mb-2"}>Raf Ömrü / Tazeleme</p>
                <input
                    type="text"
                    value={shelfLife}
                    onChange={(e) => setShelfLife(e.target.value)}
                    className="w-full px-3 py-2"
                    placeholder="Örn: 5 gün taze, oda sıcaklığında 10 gün"
                />
            </div>

            <div className={"w-full"}>
                <p className={"mb-2"}>Saklama Koşulları</p>
                <input
                    type="text"
                    value={storageInfo}
                    onChange={(e) => setStorageInfo(e.target.value)}
                    className="w-full px-3 py-2"
                    placeholder="Örn: Kuru ve serin yerde saklayın, buzdolabında"
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
                    GÜNCELLE
                </button>
        </form>
    );
};

export default Edit;
