import { useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {ShopContext} from "../context/ShopContext.jsx";
import RelatedProducts from "../components/RelatedProducts.jsx";
import {useNavigate} from "react-router-dom";

const Product = () => {
    const {productId} = useParams();
    const {products, currency, addToCart} = useContext(ShopContext);
    const [productData, setProductData] = useState(false);
    const [image, setImage] = useState("");
    const [size, setSize] = useState("");
    const [personCount, setPersonCount] = useState("");
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

    return productData ? (
        <div className={"border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100"}>
            {/*  PRODUCT DATA  */}
            <div className={"flex gap-12 sm:gap-12 flex-col sm:flex-row"}>
                {/* --- Product Images --- */}
                <div className={"flex-1 flex flex-col-reverse gap-3 sm:flex-row"}>
                    <div className={"flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full"}>
                        {
                            productData.image.map((item,index)=> (
                                <img
                                    src={item}
                                    key={index}
                                    alt={"small-image"}
                                    className={"w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"}
                                    onClick={() => setImage(item)}
                                />
                            ))
                        }
                    </div>
                    <div className={"w-full sm:w-[80%]"}>
                        <img
                            src={image}
                            alt={"big-image"}
                            className={"w-full h-auto"}
                        />
                    </div>
                </div>
                {/* --- Product Info --- */}
                <div className={"flex-1"}>
                    <h1 className={"font-medium text-2xl mt-2 text-orange-500"}> {productData.name} </h1>
                    {/*                    <div className={"flex items-center gap-1 mt-2"}>
                        <img src={assets.star_icon} alt={""} className={"w-3 5"}/>
                        <img src={assets.star_icon} alt={""} className={"w-3 5"}/>
                        <img src={assets.star_icon} alt={""} className={"w-3 5"}/>
                        <img src={assets.star_icon} alt={""} className={"w-3 5"}/>
                        <img src={assets.star_dull_icon} alt={""} className={"w-3 5"}/>s
                        <p className={"pl-2"}> (122) </p>
                    </div>*/}
                    <p className={"mt-5 text-2xl font-medium"}> {currency} {selectedPrice.toFixed(2)} </p>
                    <p className={"mt-5 text-gray-500 md:w-4/5"}> {productData.description} </p>
                    <div className={"flex flex-col gap-6 my-8"}>
                        {/* Kişi Sayısı Seçimi */}
                        {productData.personCounts && productData.personCounts.length > 0 && (
                            <div>
                                <p className="mb-3 font-medium">Kişi Sayısı</p>
                                <div className="flex flex-wrap gap-2">
                                    {productData.personCounts.map((count) => (
                                        <button
                                            key={count}
                                            onClick={() => setPersonCount(count)}
                                            className={`px-4 py-2 rounded-lg border transition-all ${
                                                personCount === count
                                                    ? 'bg-red-500 text-white border-red-500'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:border-red-500'
                                            }`}
                                        >
                                            {count}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Gramaj Seçimi */}
                        {productData.sizes && productData.sizes.length > 0 && (
                            <div>
                                <p className="mb-3 font-medium">Gramaj</p>
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
                                            className={`px-4 py-2 rounded-lg border transition-all ${
                                                size === sizeOption
                                                    ? 'bg-red-500 text-white border-red-500'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:border-red-500'
                                            }`}
                                        >
                                            {sizeOption}gr
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    {isOutOfStock && (
                        <p className={"text-red-500 font-semibold mb-2"}>Stok tükendi</p>
                    )}
                    <button
                        onClick={() => {
                            if (isOutOfStock) return;
                            addToCart(productData._id, size);
                            if(size.length > 0){
                                navigate('/cart');
                            }
                        }}
                        disabled={isOutOfStock}
                        className={`${isOutOfStock ? "bg-gray-400 cursor-not-allowed" : "bg-orange-500 active:bg-gray-700"} text-white px-10 py-4 text-sm`}
                    >
                        {isOutOfStock ? "STOK TÜKENDİ" : "SEPETE EKLE"}
                    </button>
                    <hr className={"mt-8 sm:w-4/5"}/>
                    
                    {/* Hızlı Özellikler */}
                    {productData.freshType && (
                        <div className="mt-6 flex gap-2">
                            <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs rounded">
                                {productData.freshType === 'taze' ? '🍃 Taze' : '✨ Kuru'}
                            </span>
                            {productData.packaging === 'özel' && (
                                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded">🎁 Özel Ambalaj</span>
                            )}
                            {productData.giftWrap && (
                                <span className="px-3 py-1 bg-pink-100 text-pink-700 text-xs rounded">🎀 Hediye Paketi</span>
                            )}
                            {productData.labels && productData.labels.length > 0 && (
                                productData.labels.map((label, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded">{label}</span>
                                ))
                            )}
                        </div>
                    )}

                    {/* Ürün Bilgi Kartları */}
                    <div className="mt-8 space-y-4">
                        {productData.allergens && (
                            <div className="border rounded-lg p-4 bg-red-50">
                                <h3 className="font-semibold text-red-700 mb-2">🚨 Alerjen Bilgileri</h3>
                                <p className="text-sm text-gray-700">{productData.allergens}</p>
                            </div>
                        )}
                        
                        {productData.ingredients && (
                            <div className="border rounded-lg p-4 bg-green-50">
                                <h3 className="font-semibold text-green-700 mb-2">🥘 Malzemeler</h3>
                                <p className="text-sm text-gray-700">{productData.ingredients}</p>
                            </div>
                        )}
                        
                        {productData.shelfLife && (
                            <div className="border rounded-lg p-4 bg-blue-50">
                                <h3 className="font-semibold text-blue-700 mb-2">⏰ Raf Ömrü / Tazeleme</h3>
                                <p className="text-sm text-gray-700">{productData.shelfLife}</p>
                            </div>
                        )}
                        
                        {productData.storageInfo && (
                            <div className="border rounded-lg p-4 bg-yellow-50">
                                <h3 className="font-semibold text-yellow-700 mb-2">📦 Saklama Koşulları</h3>
                                <p className="text-sm text-gray-700">{productData.storageInfo}</p>
                            </div>
                        )}
                    </div>
                    
                    <div className={"text-sm text-gray-500 mt-5 flex flex-col gap-1"}>
                        <p>Görseller orijinal ürünün görselleridir.</p>
                        <p>100% Yerli üretim.</p>
                    </div>
                </div>
            </div>

            {/* DESCRIPTION AND REVIEW */}
            {/*            <div className={"mt-20"}>
                <div className={"flex"}>
                    <b className={"border px-5 py-3 text-sm"}>Description</b>
                    <p className={"border px-5 py-3 text-sm"}>Reviews (122) </p>
                </div>
                <div className={"flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500"}>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores cum modi tempore voluptas! Aliquid blanditiis deserunt dicta dolorum nisi porro quae, quidem tempora?</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores dolor iste minus nulla, omnis placeat praesentium quas repudiandae sed sequi similique tempore, totam voluptates.</p>
                </div>
            </div>*/}
            {/* DISPLAY RELATED PRODUCTS */}
            <RelatedProducts category={productData.category} subCategory={productData.subCategory}></RelatedProducts>
        </div>
    ) : <div className={"opacity-0"}></div>
};

export default Product;
