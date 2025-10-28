import Title from "../components/Title.jsx";
import CartTotal from "../components/CartTotal.jsx";
import OrderSummary from "../components/OrderSummary.jsx";
import {useContext, useEffect, useState} from "react";
import {ShopContext} from "../context/ShopContext.jsx";
import axios from "axios";
import {toast} from "react-toastify";

const PlaceOrder = () => {
    const [method, setMethod] = useState("HAVALE/EFT");
    const [ip, setIp] = useState("");
    const [deliveryZone, setDeliveryZone] = useState("");
    const [zones, setZones] = useState([]);
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [couponCode, setCouponCode] = useState("");
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [bankInfo, setBankInfo] = useState(null);
    const [timeSlots, setTimeSlots] = useState([]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState("");

    useEffect(() => {
        fetch("https://api64.ipify.org?format=json")
            .then((res) => res.json())
            .then((data) => setIp(data.ip));
        fetchZones();
        fetchBankInfo();
        fetchTimeSlots();
    }, []);

    const fetchZones = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/delivery/zones');
            if (response.data.success) setZones(response.data.zones);
        } catch (error) { console.error(error); }
    };

    const fetchBankInfo = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/order/bank-info');
            if (response.data.success) setBankInfo(response.data.bank);
        } catch (error) { console.error(error); }
    };

    const fetchTimeSlots = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/delivery/timeslots');
            if (response.data.success) setTimeSlots(response.data.slots);
        } catch (error) { console.error(error); }
    };

    const handleCouponApply = async () => {
        if (!couponCode.trim()) return;
        try {
            const cartAmount = getCartAmount();
            const response = await axios.post(backendUrl + '/api/coupon/validate', { code: couponCode, cartTotal: cartAmount });
            if (response.data.success) {
                setCouponDiscount(response.data.discount);
                toast.success('Kupon uygulandı');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('Kupon kontrolü sırasında hata oluştu');
        }
    };

    const {
        navigate,
        backendUrl,
        token,
        cartItems,
        setCartItems,
        getCartAmount,
        getShippingFee,
        products
    } = useContext(ShopContext);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "Türkiye",
        phone: "",
    });

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        if (name === "phone" && value.startsWith('0')) {
            return;
        }

        setFormData(data => ({...data, [name]: value}))
    }

    const handlePayment = async () => {
        const userBasket = Object.entries(cartItems)
            .flatMap(([id, sizes]) => {
                const product = products.find(p => p._id === id);
                if (!product) return [];

                return Object.entries(sizes)
                    .filter(([, quantity]) => quantity > 0)
                    .map(([size, quantity]) => {
                        const sizePrice = product.sizePrices.find(sp => sp.size === size);
                        const price = (sizePrice?.price ?? product.basePrice).toFixed(2);
                        return [`${product.name} - ${size}`, price, quantity];
                    });
            });

        const userBasketBase64 = btoa(JSON.stringify(
            userBasket.length > 0 ? userBasket : [["Boş Sepet", "0.00", 1]]
        ));


        const cartAmount = getCartAmount();
        const shippingFee = getShippingFee();

        const paymentData = {
            email: formData.email,
            payment_amount: (cartAmount + shippingFee) * 100,
            user_name: `${formData.firstName} ${formData.lastName}`,
            //user_address: formData,
            user_address: `${formData.street}, ${formData.city}, ${formData.state}, ${formData.zipcode}, ${formData.country}`,
            user_phone: formData.phone,
            user_ip: ip,
            user_basket: userBasketBase64
        };

        try {
            const response = await fetch(backendUrl + '/api/paytr/get-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', token: token },
                body: JSON.stringify(paymentData),
            });

            const textResponse = await response.text();
            try {
                const data = JSON.parse(textResponse);
                window.open(backendUrl + `/paytr/payment?token=${data.token}`, '_blank');
            } catch (error) {
                console.error("Yanıt JSON formatında değil:", error);
                console.error("Backend'den gelen yanıt (HTML):", textResponse);
            }
        } catch (error) {
            console.error('Bir hata oluştu:', error);
        }
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        if (!token) {
            toast.error("Lütfen giriş yapınız.");
            navigate('/login');
            return;
        }
        try {
            const cartAmount = getCartAmount();
            const shippingFee = getShippingFee();
            let orderItems = [];
            for (const items in cartItems) {
                for (const item in cartItems[items]) {
                    if (cartItems[items][item] > 0) {
                        const itemInfo = structuredClone(products.find(product => product._id === items));
                        if (itemInfo) {
                            itemInfo.size = item;
                            itemInfo.quantity = cartItems[items][item];
                            orderItems.push(itemInfo);
                        }
                    }
                }
            }
            let orderData = {
                address: formData,
                items: orderItems,
                amount: cartAmount + shippingFee,
            }
            switch (method) {
                case 'HAVALE/EFT': {
                    const finalOrderData = {
                        ...orderData,
                        paymentMethod: method,
                        codFee: method === 'KAPIDA' ? 10 : 0,
                        delivery: deliveryZone ? { zoneId: deliveryZone, timeSlotId: selectedTimeSlot || '', sameDay: false } : {}
                    };
                    finalOrderData.amount = cartAmount - (couponDiscount || 0) + (deliveryFee || 0);
                    const response = await axios.post(backendUrl + '/api/order/place', finalOrderData, {headers: {token}});

                    if (response.data.success) {
                        setCartItems({});
                        navigate("/orders");
                        toast.success("Siparişiniz başarıyla alınmıştır.");
                    } else {
                        toast.error(response.data.message);
                    }
                    break;
                }
                case "paytr":
                {
                    await handlePayment();
                    const updateResponse = await fetch(backendUrl + '/api/order/update-paytr-order', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', token: token },
                        body: JSON.stringify({
                            address: formData,
                            items: orderItems
                        }),
                    });

                    if (!updateResponse.ok) throw new Error('Sipariş güncellenemedi');
                    break;
                }

                default:
                    break;
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const [showNewsletter, setShowNewsletter] = useState(false);
    const [currentStep, setCurrentStep] = useState('info'); // 'info' or 'payment'

    return (
        <div className="min-h-screen">
            <form onSubmit={onSubmitHandler}>
                <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
                    {/* Left Side - Tan/Beige Background */}
                    <div className="bg-[#F5F4F1] py-12 px-8">
                        <div className="max-w-2xl">
                            {/* Breadcrumb */}
                            <div className="mb-8 pb-4 border-b border-gray-200">
                                <div className="flex gap-2 text-sm text-gray-600">
                                    <button type="button" onClick={() => navigate('/cart')} className="hover:text-black">Sepet</button>
                                    <span>/</span>
                                    <button 
                                        type="button" 
                                        onClick={() => setCurrentStep('info')} 
                                        className={currentStep === 'info' ? 'text-black font-medium' : 'hover:text-black'}
                                    >
                                        Bilgiler & Teslimat
                                    </button>
                                    <span>/</span>
                                    <button 
                                        type="button" 
                                        onClick={() => setCurrentStep('payment')} 
                                        className={currentStep === 'payment' ? 'text-black font-medium' : 'hover:text-black'}
                                    >
                                        Ödeme
                                    </button>
                                </div>
                            </div>
                            {/* Contact */}
                            <div className="mb-8">
                                <h3 className="font-medium mb-4 text-base">İletişim Bilgileri</h3>
                                <input required onChange={onChangeHandler} name="email" value={formData.email} className="border border-gray-300 rounded-md py-2.5 px-3 w-full" type="email" placeholder="E-posta" />
                                
                                <label className="flex items-center gap-2 mt-3 text-sm text-gray-600">
                                    <input type="checkbox" checked={showNewsletter} onChange={(e) => setShowNewsletter(e.target.checked)} className="rounded" />
                                    <span>Haberler ve özel tekliflerden beni haberdar et</span>
                                </label>
                            </div>

                            {/* Address - Simplified for İzmir/Menemen */}
                            <div className="mt-8">
                                <h3 className="font-medium mb-4 text-base">Teslimat Adresi</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <input required onChange={onChangeHandler} name="firstName" value={formData.firstName} className="border border-gray-300 rounded-md py-2.5 px-3" type="text" placeholder="Ad" />
                                    <input required onChange={onChangeHandler} name="lastName" value={formData.lastName} className="border border-gray-300 rounded-md py-2.5 px-3" type="text" placeholder="Soyad" />
                                </div>
                                <input required onChange={onChangeHandler} name="street" value={formData.street} className="border border-gray-300 rounded-md py-2.5 px-3 w-full mt-3" type="text" placeholder="Mahalle, Sokak, Bina, Daire" />
                                <div className="grid grid-cols-2 gap-3 mt-3">
                                    <input required onChange={onChangeHandler} name="state" value={formData.state} className="border border-gray-300 rounded-md py-2.5 px-3" type="text" placeholder="Mahalle" />
                                    <input required onChange={onChangeHandler} name="zipcode" value={formData.zipcode} className="border border-gray-300 rounded-md py-2.5 px-3" type="number" placeholder="Posta Kodu" />
                                </div>
                                <div className="flex gap-2 mt-3">
                                    <span className="text-gray-500 py-2">+90</span>
                                    <input required onChange={onChangeHandler} name="phone" value={formData.phone} className="border border-gray-300 rounded-md py-2.5 px-3 flex-1" type="tel" placeholder="Telefon" minLength={10} maxLength={10} />
                                </div>
                                <input required onChange={onChangeHandler} name="city" value="İzmir" className="border border-gray-300 rounded-md py-2.5 px-3 w-full mt-3 bg-gray-100" type="text" disabled />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: SUMMARY */}
                    <div className="bg-white pl-8 py-8">
                        <OrderSummary 
                            deliveryFee={deliveryFee} 
                            couponDiscount={couponDiscount} 
                            couponCode={couponCode} 
                            setCouponCode={setCouponCode} 
                            setCouponDiscount={setCouponDiscount} 
                            handleCouponApply={handleCouponApply}
                            method={method}
                            setMethod={setMethod}
                            bankInfo={bankInfo}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default PlaceOrder;
