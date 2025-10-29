import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext.jsx";
import RelatedProducts from "../components/RelatedProducts.jsx";
import { useNavigate } from "react-router-dom";
import {
    ShoppingBagIcon,
    WarningIcon,
    SaladIcon,
    PackageIcon,
    ClockIcon,
    FreshIcon,
    SparkleIcon,
    GiftIcon,
    TagIcon,
    DocumentIcon,
    MinusIcon,
    PlusIcon
} from "./Icons.jsx";

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
        { id: "description", label: "Ürün Açıklaması", icon: <DocumentIcon className="w-4 h-4" /> },
        { id: "nutrition", label: "Besin Değerleri", icon: <SaladIcon className="w-4 h-4" /> },
        { id: "allergens", label: "Alerjenler", icon: <WarningIcon className="w-4 h-4" /> },
        { id: "storage", label: "Saklama Koşulları", icon: <PackageIcon className="w-4 h-4" /> }
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
                            <h1 className="font-semibold text-3xl mt-2 text-gray-800">{productData.name}</h1>

                            {/* Quick Tags */}
                            <div className="mt-3 flex flex-wrap gap-2">
                                {productData.freshType && (
                                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full font-medium flex items-center gap-1">
                                        {productData.freshType === 'taze' ? <FreshIcon className="w-4 h-4" /> : <SparkleIcon className="w-4 h-4" />}
                                        {productData.freshType === 'taze' ? 'Taze Ürün' : 'Kuru Ürün'}
                                    </span>
                                )}
                                {productData.packaging === 'özel' && (
                                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full font-medium flex items-center gap-1">
                                        <GiftIcon className="w-4 h-4" />
                                        Özel Ambalaj
                                    </span>
                                )}
                                {productData.giftWrap && (
                                    <span className="px-3 py-1 bg-pink-100 text-pink-700 text-sm rounded-full font-medium flex items-center gap-1">
                                        <GiftIcon className="w-4 h-4" />
                                        Hediye Paketi
                                    </span>
                                )}
                                {productData.labels && productData.labels.length > 0 && (
                                    productData.labels.map((label, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium flex items-center gap-1">
                                            <TagIcon className="w-4 h-4" />
                                            {label}
                                        </span>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    <p className="mt-4 text-3xl font-bold text-orange-500 price-display">
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
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors shadow-lg hover:shadow-xl mb-6 flex items-center justify-center gap-2"
                        >
                            <ShoppingBagIcon className="w-5 h-5" />
                            SEPETE EKLE
                        </button>
                    )}

                    {/* Quick Info Cards - Space Efficient Layout */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        {productData.allergens && (
                            <div
                                className="border border-red-200 rounded-xl p-4 bg-red-50 cursor-pointer hover:bg-red-100 transition-colors"
                                onClick={() => toggleSection('allergens')}
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-red-700 flex items-center gap-2">
                                        <WarningIcon className="w-5 h-5" />
                                        Alerjenler
                                    </h3>
                                    <span className="text-red-500">
                                        {expandedSections.allergens ? <MinusIcon /> : <PlusIcon />}
                                    </span>
                                </div>
                                {expandedSections.allergens && (
                                    <p className="text-sm text-gray-700 mt-2">{productData.allergens}</p>
                                )}
                            </div>
                        )}

                        {productData.ingredients && (
                            <div
                                className="border border-green-200 rounded-xl p-4 bg-green-50 cursor-pointer hover:bg-green-100 transition-colors"
                                onClick={() => toggleSection('ingredients')}
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-green-700 flex items-center gap-2">
                                        <SaladIcon className="w-5 h-5" />
                                        Malzemeler
                                    </h3>
                                    <span className="text-green-500">
                                        {expandedSections.ingredients ? <MinusIcon /> : <PlusIcon />}
                                    </span>
                                </div>
                                {expandedSections.ingredients && (
                                    <p className="text-sm text-gray-700 mt-2">{productData.ingredients}</p>
                                )}
                            </div>
                        )}

                        {productData.shelfLife && (
                            <div
                                className="border border-blue-200 rounded-xl p-4 bg-blue-50 cursor-pointer hover:bg-blue-100 transition-colors"
                                onClick={() => toggleSection('shelfLife')}
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-blue-700 flex items-center gap-2">
                                        <ClockIcon className="w-5 h-5" />
                                        Raf Ömrü
                                    </h3>
                                    <span className="text-blue-500">
                                        {expandedSections.shelfLife ? <MinusIcon /> : <PlusIcon />}
                                    </span>
                                </div>
                                {expandedSections.shelfLife && (
                                    <p className="text-sm text-gray-700 mt-2">{productData.shelfLife}</p>
                                )}
                            </div>
                        )}

                        {productData.storageInfo && (
                            <div
                                className="border border-yellow-200 rounded-xl p-4 bg-yellow-50 cursor-pointer hover:bg-yellow-100 transition-colors"
                                onClick={() => toggleSection('storageInfo')}
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-yellow-700 flex items-center gap-2">
                                        <PackageIcon className="w-5 h-5" />
                                        Saklama
                                    </h3>
                                    <span className="text-yellow-600">
                                        {expandedSections.storageInfo ? <MinusIcon /> : <PlusIcon />}
                                    </span>
                                </div>
                                {expandedSections.storageInfo && (
                                    <p className="text-sm text-gray-700 mt-2">{productData.storageInfo}</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Trust Badges */}
                    <div className="border-t pt-6 mt-6">
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <span className="text-green-500">✓</span>
                                <span>Görseller orijinal ürüne aittir</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-green-500">✓</span>
                                <span>100% Yerli üretim</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-green-500">✓</span>
                                <span>Güvenli alışveriş</span>
                            </div>
                        </div>
                    </div>
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
                                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                                    activeTab === tab.id
                                        ? 'border-orange-500 text-orange-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <span className="mr-2 flex items-center">{tab.icon}</span>
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
                                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                                        <SaladIcon className="w-5 h-5" />
                                        İçerik ve Malzemeler
                                    </h4>
                                    <p className="text-gray-700">{productData.ingredients}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Nutrition Tab */}
                    {activeTab === "nutrition" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white border border-gray-200 rounded-xl p-6">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <SaladIcon className="w-5 h-5" />
                                Besin Değerleri
                            </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-600">Enerji</span>
                                        <span className="font-medium">--- kcal</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-600">Protein</span>
                                        <span className="font-medium">--- g</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-600">Karbonhidrat</span>
                                        <span className="font-medium">--- g</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="text-gray-600">Yağ</span>
                                        <span className="font-medium">--- g</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-xl p-6">
                                <h3 className="text-lg font-semibold mb-4">🧪 Minarel ve Vitaminler</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-600">Lif</span>
                                        <span className="font-medium">--- g</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-600">Tuz</span>
                                        <span className="font-medium">--- g</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-600">Şeker</span>
                                        <span className="font-medium">--- g</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="text-gray-600">Doymuş Yağ</span>
                                        <span className="font-medium">--- g</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Allergens Tab */}
                    {activeTab === "allergens" && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <WarningIcon className="w-8 h-8 text-red-600" />
                                <h3 className="text-xl font-semibold text-red-700">Alerjen Uyarısı</h3>
                            </div>
                            <div className="bg-white rounded-lg p-6 mb-4">
                                <p className="text-gray-700 leading-relaxed">
                                    {productData.allergens || "Bu ürün için belirtilen alerjen bilgisi bulunmamaktadır."}
                                </p>
                            </div>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <p className="text-sm text-yellow-800">
                                    <strong>Önemli Not:</strong> Alerjen hassasiyetiniz varsa, ürünü tüketmeden önce mutlaka etiket bilgilerini kontrol ediniz.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Storage Tab */}
                    {activeTab === "storage" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <PackageIcon className="w-5 h-5" />
                                    Saklama Koşulları
                                </h3>
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
                                    <ClockIcon className="w-5 h-5" />
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