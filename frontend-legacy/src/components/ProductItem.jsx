import {useContext} from 'react';
import {ShopContext} from "../context/ShopContext.jsx";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";

const ProductItem = ({id, image, name, price, freshType, packaging, giftWrap, labels}) => {
    const {currency} = useContext(ShopContext);
    return (
        <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
            <Link to={`/product/${id}`} className="block">
                <div className="relative overflow-hidden aspect-square">
                    <img
                        src={image?.[0] || '/placeholder.png'}
                        alt={name || 'product-image'}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
                    
                    {/* Badge'ler görsel üzerinde */}
                    <div className="absolute top-2 left-2 flex gap-1 flex-wrap z-10">
                        {freshType && (
                            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                                {freshType === 'taze' ? '🍃 Taze' : '✨ Kuru'}
                            </span>
                        )}
                        {packaging === 'özel' && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">🎁 Özel</span>
                        )}
                        {giftWrap && (
                            <span className="px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded-full font-medium">🎀</span>
                        )}
                        {labels && labels.length > 0 && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                                {labels[0]}
                            </span>
                        )}
                    </div>
                </div>
            </Link>
            
            {/* Product Info */}
            <div className="p-4">
                <Link to={`/product/${id}`} className="block">
                    <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 mb-1 text-sm">
                        {name}
                    </h3>
                    {labels && labels.length > 0 && (
                        <p className="text-xs text-gray-500 mb-2 line-clamp-1">{labels.join(', ')}</p>
                    )}
                </Link>
                <p className="text-base font-bold text-gray-900 mt-2">
                    {price} {currency}
                </p>
            </div>
        </div>
    );
};

ProductItem.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    price: PropTypes.number,
    image: PropTypes.node,
    freshType: PropTypes.string,
    packaging: PropTypes.string,
    giftWrap: PropTypes.bool,
    labels: PropTypes.array,
}

export default ProductItem;