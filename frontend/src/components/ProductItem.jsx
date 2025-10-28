import {useContext} from 'react';
import {ShopContext} from "../context/ShopContext.jsx";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";

const ProductItem = ({id, image, name, price, freshType, packaging, giftWrap, labels}) => {
    const {currency} = useContext(ShopContext);
    return (
        <Link to={`/product/${id}`} className={"text-gray-700 cursor-pointer"}>
            <div className={"relative overflow-hidden"}>
                <img
                    src={image[0]}
                    alt={"product-image"}
                    className="hover:scale-110 transition ease-in-out w-full"
                />
                {/* Badge'ler görsel üzerinde */}
                <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
                    {freshType && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">
                            {freshType === 'taze' ? '🍃 Taze' : '✨ Kuru'}
                        </span>
                    )}
                    {packaging === 'özel' && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">🎁 Özel</span>
                    )}
                    {giftWrap && (
                        <span className="px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded">🎀</span>
                    )}
                </div>
            </div>
            <p className={"pt-3 pb-1 text-sm"}> {name} </p>
            {labels && labels.length > 0 && (
                <p className="text-xs text-gray-500">{labels.join(', ')}</p>
            )}
            <p className={"text-sm font-medium"}> {price} {currency} </p>
        </Link>
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