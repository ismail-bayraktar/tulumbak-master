import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext.jsx";
import RelatedProducts from "../components/RelatedProducts.jsx";
import { useNavigate } from "react-router-dom";
import {
    ShoppingBag,
    Package,
    Clock,
    Sun,
    Sparkles,
    Gift,
    Tag,
    Shield,
    Truck,
    RefreshCw
} from "lucide-react";

const ModernProductDetail = () => {
    const { productId } = useParams();
    const { products, currency, addToCart } = useContext(ShopContext);
    const [productData, setProductData] = useState(false);
    const [image, setImage] = useState("");
    const [size, setSize] = useState("");
    const [personCount, setPersonCount] = useState("");
    const [activeTab, setActiveTab] = useState("description");
    const [expandedSections, setExpandedSections] = useState({});
    const navigate = useNavigate();
    const [selectedPrice, setSelectedPrice] = useState(0);
    const isOutOfStock = productData && typeof productData.stock === "number" ? productData.stock <= 0 : false;

    const fetchProductData = async () => {
        products.map((item) => {
            if (item._id === productId) {
                setProductData(item);
                setImage(item.image[0]);
                setSelectedPrice(item.basePrice);
                return null;
            }
        })
    }

    useEffect(() => {
        fetchProductData();
    }, [productId, products]);

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const tabs = [
        { id: "description", label: "Ürün Açıklaması" },
        { id: "storage", label: "Saklama Koşulları" }
    ];

    return productData ? (
        <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
            {/* PRODUCT DATA */}
            <div className="flex gap-12 sm:gap-12 flex-col lg:flex-row">
                {/* Product Images */}
                <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
                    <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
                        {productData.image.map((item, index) => (
                            <img
                                src={item}
                                key={index}
                                alt="product-thumbnail"
                                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer border-2 border-gray-200 rounded-lg hover:border-orange-500 transition-colors"
                                onClick={() => setImage(item)}
                            />
                        ))}
                    </div>
                    <div className="w-full sm:w-[80%]">
                        <img
                            src={image}
                            alt="product-main"
                            className="w-full h-auto rounded-lg shadow-lg"
                        />
                    </div>
                </div>

                {/* Product Info */}
                <div className="flex-1">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h1 className="heading-primary font-semibold text-3xl mt-2 text-text-primary">{productData.name}</h1>

                            {/* Quick Tags */}
                            <div className="mt-3 flex flex-wrap gap-2">
                                {productData.freshType && (
                                    <span className="px-3 py-1 bg-success/10 text-success-700 text-sm rounded-full font-medium flex items-center gap-1">
                                        {productData.freshType === 'taze' ? <Sun className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                                        {productData.freshType === 'taze' ? 'Taze Ürün' : 'Kuru Ürün'}
                                    </span>
                                )}
                                {productData.packaging === 'özel' && (
                                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full font-medium flex items-center gap-1">
                                        <Gift className="w-4 h-4" />
                                        Özel Ambalaj
                                    </span>
                                )}
                                {productData.giftWrap && (
                                    <span className="px-3 py-1 bg-pink-100 text-pink-700 text-sm rounded-full font-medium flex items-center gap-1">
                                        <Gift className="w-4 h-4" />
                                        Hediye Paketi
                                    </span>
                                )}
                                {productData.labels && productData.labels.length > 0 && (
                                    productData.labels.map((label, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium flex items-center gap-1">
                                            <Tag className="w-4 h-4" />
                                            {label}
                                        </span>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    <p className="mt-4 text-3xl font-bold text-primary-600 price-display">
                        <span className="turkish-lira">₺</span> {selectedPrice.toFixed(2)}
                    </p>

                    <p className="mt-4 text-gray-600 leading-relaxed">{productData.description}</p>

                    {/* Selection Options */}
                    <div className="flex flex-col gap-6 my-8">
                        {/* Person Count Selection */}
                        {productData.personCounts && productData.personCounts.length > 0 && (
                            <div>
                                <p className="mb-3 font-semibold text-gray-700">Kaç Kişilik?</p>
                                <div className="flex flex-wrap gap-2">
                                    {productData.personCounts.map((count) => (
                                        <button
                                            key={count}
                                            onClick={() => setPersonCount(count)}
                                            className={`px-6 py-3 rounded-xl border-2 transition-all font-medium ${
                                                personCount === count
                                                    ? 'bg-orange-500 text-white border-orange-500'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:border-orange-500 hover:bg-orange-50'
                                            }`}
                                        >
                                            {count} Kişi
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Size Selection */}
                        {productData.sizes && productData.sizes.length > 0 && (
                            <div>
                                <p className="mb-3 font-semibold text-gray-700">Gramaj</p>
                                <div className="flex flex-wrap gap-2">
                                    {productData.sizes.map((sizeOption) => (
                                        <button
                                            key={sizeOption}
                                            onClick={() => {
                                                setSize(sizeOption);
                                                const sizePrice = productData.sizePrices?.find(
                                                    (sp) => Number(sp.size) === Number(sizeOption)
                                                );
                                                if (sizePrice) {
                                                    setSelectedPrice(sizePrice.price);
                                                } else {
                                                    setSelectedPrice(productData.basePrice);
                                                }
                                            }}
                                            className={`px-6 py-3 rounded-xl border-2 transition-all font-medium ${
                                                size === sizeOption
                                                    ? 'bg-orange-500 text-white border-orange-500'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:border-orange-500 hover:bg-orange-50'
                                            }`}
                                        >
                                            {sizeOption}gr
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Stock Status and Add to Cart */}
                    {isOutOfStock ? (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                            <p className="text-red-600 font-semibold text-center">🚫 Bu ürün şu an stokta bulunmamaktadır</p>
                        </div>
                    ) : (
                        <button
                            onClick={() => {
                                addToCart(productData._id, size);
                                if (size.length > 0) {
                                    navigate('/cart');
                                }
                            }}
                            className="relative w-full bg-orange-500 hover:bg-orange-600 text-white px-12 sm:px-20 py-4 rounded-lg text-cta text-base transition-all duration-300 shadow-modern hover:shadow-modern-lg hover:scale-[1.01] mb-8 flex items-center justify-center gap-3 overflow-hidden group font-semibold"
                        >
                            <ShoppingBag className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                            <span className="relative z-10">SEPETE EKLE</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                        </button>
                    )}

  
                                    </div>
            </div>

            {/* Detailed Information Tabs */}
            <div className="mt-16">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8 overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-3 px-1 border-b-2 heading-secondary text-sm transition-all duration-300 whitespace-nowrap ${
                                    activeTab === tab.id
                                        ? 'border-primary-600 text-primary-600'
                                        : 'border-transparent text-text-secondary hover:text-text-primary hover:border-primary-300'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="mt-8">
                    {/* Description Tab */}
                    {activeTab === "description" && (
                        <div className="prose max-w-none">
                            <h3 className="text-xl font-semibold mb-4">Ürün Hakkında Detaylı Bilgi</h3>
                            <p className="text-gray-600 leading-relaxed mb-4">{productData.description}</p>
                            {productData.ingredients && (
                                <div className="mt-6 p-6 bg-gray-50 rounded-xl">
                                    <h4 className="font-semibold mb-3">İçerik ve Malzemeler</h4>
                                    <p className="text-gray-700">{productData.ingredients}</p>
                                </div>
                            )}
                        </div>
                    )}

  
    
                    {/* Storage Tab */}
                    {activeTab === "storage" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                                <h3 className="text-lg font-semibold mb-4">Saklama Koşulları</h3>
                                <p className="text-gray-700 mb-4">
                                    {productData.storageInfo || "Ürünü serin ve kuru yerde saklayınız."}
                                </p>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="text-blue-500">•</span>
                                        <span>Oda sıcaklığında saklayınız</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-blue-500">•</span>
                                        <span>Güneş ışığından koruyunuz</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-blue-500">•</span>
                                        <span>Nemli ortamlardan uzak tutunuz</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Clock className="w-5 h-5" />
                                    Tazelik ve Raf Ömrü
                                </h3>
                                <p className="text-gray-700 mb-4">
                                    {productData.shelfLife || "Ürün son kullanma tarihine kadar tüketebilirsiniz."}
                                </p>
                                <div className="bg-white rounded-lg p-4">
                                    <p className="text-sm text-gray-600">
                                        <strong>Öneri:</strong> Ürünü açtıktan sonra mümkün olan en kısa sürede tüketiniz.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* RELATED PRODUCTS */}
            <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
        </div>
    ) : <div className="opacity-0"></div>
};

export default ModernProductDetail;