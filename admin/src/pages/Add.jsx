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
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    return (
        <form onSubmit={onSubmitHandler} className={"flex flex-col w-full items-start gap-3"}>
            <div>
                <p className={"mb-2"}>Görsel Yükle</p>
                <div className={"flex gap-2"}>
                    {[1, 2, 3, 4].map((num) => (
                        <label htmlFor={`image${num}`} key={num}>
                            <img
                                className={"w-20"}
                                src={
                                    !eval(`image${num}`) ? assets.upload_area : URL.createObjectURL(eval(`image${num}`))
                                }
                                alt=""
                            />
                            <input
                                onChange={(e) => eval(`setImage${num}(e.target.files[0])`)}
                                type={"file"}
                                id={`image${num}`}
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

                {/*
                 <div>
                    <p className={"mb-2"}>Sub category</p>
                    <select
                        onChange={(e) => setSubCategory(e.target.value)}
                        className={"w-full px-3 py-2"}
                    >
                        <option value=""></option>
                        <option value="Ceviz">Ceviz</option>
                        <option value="İncir">İncir</option>
                        <option value="Fındık">Fındık</option>
                        <option value="Badem">Badem</option>
                        <option value="Fasulye">Fasulye</option>
                        <option value="Mürdüm Eriği">Mürdüm Eriği</option>
                        <option value="Cennet Hurması">Cennet Hurması</option>
                    </select>
                </div>
               */}

                <div>
                    <p className={"mb-2"}>Ürün Fiyatı</p>
                    <input
                        onChange={(e) => setPrice(e.target.value)}
                        value={price}
                        className={"w-full px-3 py-2 sm:w-[120px]"}
                        type={"Number"}
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
                    {["2-3 Kişilik", "5-6 Kişilik", "8-10 Kişilik", "12+ Kişilik"].map((count) => (
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
                    {availableSizes.map((size) => (
                        <div
                            key={size}
                            onClick={() =>
                                setSizes((prev) =>
                                    prev.includes(size)
                                        ? prev.filter((item) => item !== size)
                                        : [...prev, size]
                                )
                            }
                        >
                            <p
                                className={`${
                                    sizes.includes(size) ? "bg-pink-100" : "bg-slate-200"
                                } px-3 py-1 cursor-pointer`}
                            >
                                {size}gr
                            </p>
                        </div>
                    ))}
                </div>
            </div>

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
