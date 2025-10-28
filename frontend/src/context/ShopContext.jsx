import {createContext, useEffect, useState} from "react";
//import {products} from "../assets/assets.js";
import PropTypes from "prop-types";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import axios from "axios";


export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = '₺';
    const deliveryFee = 90;
    const freeShippingThreshold = 3000;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [search, setSearch] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState("");
    const navigate = useNavigate();

    const addToCart = async (itemId, size) => {
        if(!size){
            toast.error('Lütfen kilo seçiniz.')
            return;
        }

        let cartData = structuredClone(cartItems);
        if (cartData[itemId]){
            if(cartData[itemId][size]){
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(backendUrl + "/api/cart/add", {itemId, size}, {headers:{token}});
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
        toast.success("Ürün başarıyla sepetinize eklendi.")
    }

    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId][size] = quantity;
        setCartItems(cartData);
        if (token) {
           try {
             await axios.post(backendUrl + "/api/cart/update", {itemId, size, quantity}, {headers: {token}})
               toast.success("Kilo güncellendi")
           } catch(error) {
               console.log(error);
               toast.error(error.message);
           }
        }
    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems){
            for(const item in cartItems[items]){
                try{
                    if(cartItems[items][item] > 0){
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
        return totalCount;
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            const itemInfo = products.find((product) => product._id === items);
            for (const size in cartItems[items]) {
                try {
                    if (cartItems[items][size] > 0) {
                        const sizePrice = itemInfo.sizePrices.find(
                            (sp) => sp.size === parseFloat(size)
                        );
                        if (sizePrice) {
                            totalAmount += sizePrice.price * cartItems[items][size];
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
        return totalAmount;
    };

    const getShippingFee = () => {
        const cartAmount = getCartAmount();
        return cartAmount >= freeShippingThreshold ? 0 : deliveryFee;
    };


    // get products from backend
    const getProductsData = async () => {
        try {
            const response = await axios.get(backendUrl + "/api/product/list")
            if(response.data.success){
                setProducts(response.data.products);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const getUserCart = async (token) => {
        try {
            const response = await axios.post(backendUrl + '/api/cart/get', {}, {headers: {token}});
            if(response.data.success){
                setCartItems(response.data.cartData);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    useEffect(() => {
        getProductsData();
    }, [])

    useEffect(() => {
        if (!token && localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"));
            getUserCart(localStorage.getItem("token"));
        }
    },[])

    const value = {
        products,
        currency,
        deliveryFee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItems,
        addToCart,
        getCartCount,
        updateQuantity,
        getCartAmount,
        getShippingFee,
        navigate,
        backendUrl,
        setToken,
        token,
        setCartItems,
        freeShippingThreshold,
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
};

ShopContextProvider.propTypes = {
    children: PropTypes.node,
}

export default ShopContextProvider;
