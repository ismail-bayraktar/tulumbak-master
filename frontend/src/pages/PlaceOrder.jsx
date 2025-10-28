import Title from "../components/Title.jsx";
import CartTotal from "../components/CartTotal.jsx";
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
            return; // Eğer token yoksa işlemi durdur
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
                // api calls for cod
                case 'HAVALE/EFT': {
                    const finalOrderData = {
                        ...orderData,
                        paymentMethod: method,
                        codFee: method === 'KAPIDA' ? 10 : 0,
                        delivery: deliveryZone ? { zoneId: deliveryZone, timeSlotId: '', sameDay: false } : {}
                    };
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
                            address: formData, // Object formatında adres
                            items: orderItems // Array formatında ürünler
                        }),
                    });

                    if (!updateResponse.ok) throw new Error('Sipariş güncellenemedi');
                    break;
                }

                default:
                    break;
            }
        } catch (error) {
            //console.log(error);
            toast.error(error.message);
        }
    }


    return (
        <form onSubmit={onSubmitHandler}
              className={"flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"}>
            {/* LEFT SIDE */}
            <div className={"flex flex-col gap-4 w-full sm:max-w-[480px]"}>
                <div className={"text-xl sm:text-2xl my-3"}>
                    <Title primaryText={"TESLİMAT"} secondaryText={"BİLGİLERİ"}/>
                </div>
                <div className={"flex gap-3"}>
                    <input
                        required
                        onChange={onChangeHandler}
                        name={"firstName"}
                        value={formData.firstName}
                        className={"border border-gray-300 rounded py-1.5 px-3.5 w-full"}
                        type={"text"}
                        placeholder={"Adınız"}
                    />
                    <input
                        required
                        onChange={onChangeHandler}
                        name={"lastName"}
                        value={formData.lastName}
                        className={"border border-gray-300 rounded py-1.5 px-3.5 w-full"}
                        type={"text"}
                        placeholder={"Soyadınız"}
                    />
                </div>
                <input
                    required
                    onChange={onChangeHandler}
                    name={"email"}
                    value={formData.email}
                    className={"border border-gray-300 rounded py-1.5 px-3.5 w-full"}
                    type={"email"}
                    placeholder={"Email Adresiniz"}
                />
                <input
                    required
                    onChange={onChangeHandler}
                    name={"street"}
                    value={formData.street}
                    className={"border border-gray-300 rounded py-1.5 px-3.5 w-full"}
                    type={"text"}
                    placeholder={"Sokak Adı, Bina No, Kapı No"}
                />
                <div className={"flex gap-3"}>
                    <input
                        required
                        onChange={onChangeHandler}
                        name={"city"}
                        value={formData.city}
                        className={"border border-gray-300 rounded py-1.5 px-3.5 w-full"}
                        type={"text"}
                        placeholder={"Şehir"}
                    />
                    <input
                        required
                        onChange={onChangeHandler}
                        name={"state"}
                        value={formData.state}
                        className={"border border-gray-300 rounded py-1.5 px-3.5 w-full"}
                        type={"text"}
                        placeholder={"Mahalle"}
                    />
                </div>
                <div className={"flex gap-3"}>
                    <input
                        required
                        onChange={onChangeHandler}
                        name={"zipcode"}
                        value={formData.zipcode}
                        className={"border border-gray-300 rounded py-1.5 px-3.5 w-full"}
                        type={"number"}
                        placeholder={"Posta Kodu"}
                    />
                    <input
                        required
                        onChange={onChangeHandler}
                        name={"country"}
                        value={formData.country}
                        className={"border border-gray-300 rounded py-1.5 px-3.5 w-full"}
                        type={"text"}
                        placeholder={"Ülke"}
                        disabled={true}
                    />
                </div>
                <div className={"flex gap-3"}>
                    <p className={"text-m mt-2"}>+90</p>
                    <input
                        required
                        onChange={onChangeHandler}
                        name={"phone"}
                        value={formData.phone}
                        className={"border border-gray-300 rounded py-1.5 px-3.5 w-full"}
                        type={"tel"}
                        placeholder={"Telefon Numaranız"}
                        minLength={10}
                        maxLength={10}
                    />

                </div>

                </div>

            {/* DELIVERY ZONE SELECTION */}
            <div className={"mt-4"}>
                <p className={"mb-2 font-medium"}>Teslimat Bölgesi</p>
                <select
                    value={deliveryZone}
                    onChange={(e) => {
                        setDeliveryZone(e.target.value);
                        const zone = zones.find(z => z._id === e.target.value);
                        if (zone) setDeliveryFee(zone.fee);
                    }}
                    className={"w-full border border-gray-300 rounded py-2 px-3"}
                >
                    <option value="">Bölge seçiniz</option>
                    {zones.map((zone) => (
                        <option key={zone._id} value={zone._id}>
                            {zone.district} - {zone.fee}₺
                        </option>
                    ))}
                </select>
            </div>

            {/* COUPON INPUT */}
            <div className={"mt-4"}>
                <p className={"mb-2 font-medium"}>Kupon Kodu</p>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Kupon kodu girin"
                        className="flex-1 border border-gray-300 rounded py-2 px-3"
                    />
                    <button
                        type="button"
                        onClick={handleCouponApply}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                    >
                        Uygula
                    </button>
                </div>
                {couponDiscount > 0 && <p className="text-green-600 text-sm mt-2">İndirim: {couponDiscount.toFixed(2)}₺</p>}
            </div>

            {/* TIME SLOT SELECTION */}
            {deliveryZone && timeSlots.length > 0 && (
                <div className="mt-4">
                    <p className="mb-2 font-medium">Teslimat Zamanı</p>
                    <select
                        value={selectedTimeSlot}
                        onChange={(e) => setSelectedTimeSlot(e.target.value)}
                        className="w-full border border-gray-300 rounded py-2 px-3"
                    >
                        <option value="">Zaman aralığı seçiniz</option>
                        {timeSlots.map((slot) => (
                            <option key={slot._id} value={slot._id}>
                                {slot.label} ({slot.start} - {slot.end})
                            </option>
                        ))}
                    </select>
                </div>
            )}

            { /* RIGHT SIDE */}
            <div className={"mt-8"}>
                <div className={"mt-8 min-w-80"}>
                    <CartTotal/>
                    {deliveryFee > 0 && (
                        <div className="flex justify-between text-sm mt-2">
                            <p>Teslimat Ücreti</p>
                            <p>{currency} {deliveryFee.toFixed(2)}</p>
                        </div>
                    )}
                </div>

                <div className={"mt-12"}>
                    <Title primaryText={"ÖDEME"} secondaryText={"YÖNTEMİ"}/>
                    {/* --- Payment Method Selection --- */}
                    <div className={"flex gap-3 flex-col lg:flex-row"}>


                        {/*
                       <div onClick={() => setMethod('stripe')}
                             className={"flex items-center gap-3 border p-2 px-3 cursor-pointer"}>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
                            <img
                                className={"h-5 mx-4"}
                                src={assets.stripe_logo}
                                alt={"stripe-logo"}
                            />
                        </div>

                        <div onClick={() => setMethod('razorpay')}
                             className={"flex items-center gap-3 border p-2 px-3 cursor-pointer"}>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-400' : ''}`}></p>
                            <img
                                className={"h-5 mx-4"}
                                src={assets.razorpay_logo}
                                alt={"razorpay-logo"}
                            />
                        </div>
*/}
                        <div onClick={() => setMethod('KAPIDA')}
                             className={"flex items-center gap-3 border p-2 px-3 cursor-pointer"}>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'KAPIDA' ? 'bg-green-400' : ''}`}></p>
                            <p className={"text-gray-800 text-sm font-medium mx-4"}>KAPIDA ÖDEME</p>
                        </div>
                        <div onClick={() => setMethod('HAVALE/EFT')}
                             className={"flex items-center gap-3 border p-2 px-3 cursor-pointer"}>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'HAVALE/EFT' ? 'bg-green-400' : ''}`}></p>
                            <p className={"text-gray-800 text-sm font-medium mx-4"}>HAVALE / EFT</p>
                        </div>
                        <div onClick={() => setMethod('paytr')} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'paytr' ? 'bg-green-400' : ''}`}></p>
                            <p className="text-gray-800 text-sm font-medium mx-4">KREDİ/BANKA KARTI</p>
                        </div>
                    </div>
                    {method === "HAVALE/EFT" && bankInfo
                        ? (
                            <div>
                                <div className={"flex items-center justify-center border mt-4 p-2 px-3"}>
                                    <p className={"text-gray-800 text-sm font-medium mx-4"}>HAVALE / EFT BİLGİLERİ</p>
                                </div>
                                <div className={"border p-2 px-3"}>
                                    <p className={"text-gray-800 text-sm font-medium"}>Hesap Adı: {bankInfo.accountName}</p>
                                    <p className={"text-gray-800 text-sm font-medium"}>Banka: {bankInfo.bankName}</p>
                                    <p className={"text-gray-800 text-sm font-medium"}>IBAN: {bankInfo.iban}</p>
                                </div>
                            </div>
                        ) : null}
                    {method === "KAPIDA" && (
                        <div className="border mt-4 p-2 px-3 text-sm text-orange-600">
                            Kapıda ödeme ek ücreti: 10₺ eklenecektir.
                        </div>
                    )}


                    <div className={"w-full text-end mt-8"}>
                        <button
                            type="submit"
                            className={"bg-black text-white px-16 py-3 text-sm"}
                        >SİPARİŞİ TAMAMLA
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default PlaceOrder;
