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

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <div className="bg-white border-b py-4">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex gap-2 text-sm text-gray-600">
                        <span>Sepet</span>
                        <span>/</span>
                        <span className="text-black font-medium">Bilgiler</span>
                        <span>/</span>
                        <span>Teslimat</span>
                        <span>/</span>
                        <span>Ödeme</span>
                    </div>
                </div>
            </div>
            
            <form onSubmit={onSubmitHandler} className="py-8">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* LEFT: FORMS */}
                        <div className="space-y-6">

                            {/* Contact */}
                            <div className="bg-white p-4 rounded-lg border">
                                <h3 className="font-medium mb-4">İletişim Bilgileri</h3>
                                <input required onChange={onChangeHandler} name="email" value={formData.email} className="border border-gray-300 rounded-md py-2.5 px-3 w-full" type="email" placeholder="E-posta" />
                                
                                <label className="flex items-center gap-2 mt-3 text-sm">
                                    <input type="checkbox" checked={showNewsletter} onChange={(e) => setShowNewsletter(e.target.checked)} className="rounded" />
                                    <span>Haberler ve özel tekliflerden beni haberdar et</span>
                                </label>
                            </div>

                            {/* Address */}
                            <div className="bg-white p-4 rounded-lg border">
                                <h3 className="font-medium mb-4">Teslimat Adresi</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <input required onChange={onChangeHandler} name="firstName" value={formData.firstName} className="border border-gray-300 rounded-md py-2.5 px-3" type="text" placeholder="Ad (isteğe bağlı)" />
                                    <input required onChange={onChangeHandler} name="lastName" value={formData.lastName} className="border border-gray-300 rounded-md py-2.5 px-3" type="text" placeholder="Soyad" />
                                </div>
                                <input required onChange={onChangeHandler} name="street" value={formData.street} className="border border-gray-300 rounded-md py-2.5 px-3 w-full mt-3" type="text" placeholder="Adres" />
                                <input onChange={onChangeHandler} name="apartment" value="" className="border border-gray-300 rounded-md py-2.5 px-3 w-full mt-3" type="text" placeholder="Daire, süit vb. (isteğe bağlı)" />
                                <input required onChange={onChangeHandler} name="city" value={formData.city} className="border border-gray-300 rounded-md py-2.5 px-3 w-full mt-3" type="text" placeholder="Şehir" />
                                <div className="grid grid-cols-3 gap-3 mt-3">
                                    <select onChange={onChangeHandler} name="country" value={formData.country} className="border border-gray-300 rounded-md py-2.5 px-3" disabled>
                                        <option value="Türkiye">Türkiye</option>
                                    </select>
                                    <input required onChange={onChangeHandler} name="state" value={formData.state} className="border border-gray-300 rounded-md py-2.5 px-3" type="text" placeholder="Bölge" />
                                    <input required onChange={onChangeHandler} name="zipcode" value={formData.zipcode} className="border border-gray-300 rounded-md py-2.5 px-3" type="number" placeholder="Posta Kodu" />
                                </div>
                                <div className="flex gap-2 mt-3">
                                    <span className="py-2 px-3">+90</span>
                                    <input required onChange={onChangeHandler} name="phone" value={formData.phone} className="border border-gray-300 rounded-md py-2.5 px-3 flex-1" type="tel" placeholder="Telefon" minLength={10} maxLength={10} />
                                </div>
                            </div>

                            {/* Delivery */}
                            <div className="bg-white p-4 rounded-lg border">
                                <h3 className="font-medium mb-4">Teslimat</h3>
                                <select value={deliveryZone} onChange={(e) => { setDeliveryZone(e.target.value); const zone = zones.find(z => z._id === e.target.value); if (zone) setDeliveryFee(zone.fee); }} className="w-full border border-gray-300 rounded-md py-2.5 px-3">
                                    <option value="">Bölge seçiniz</option>
                                    {zones.map((zone) => (<option key={zone._id} value={zone._id}>{zone.district} - {zone.fee}₺</option>))}
                                </select>
                                {deliveryZone && timeSlots.length > 0 && (
                                    <select value={selectedTimeSlot} onChange={(e) => setSelectedTimeSlot(e.target.value)} className="w-full border border-gray-300 rounded-md py-2.5 px-3 mt-3">
                                        <option value="">Zaman aralığı seçiniz</option>
                                        {timeSlots.map((slot) => (<option key={slot._id} value={slot._id}>{slot.label} ({slot.start} - {slot.end})</option>))}
                                    </select>
                                )}
                            </div>

                            {/* Coupon */}
                            <div className="bg-white p-4 rounded-lg border">
                                <h3 className="font-medium mb-4">İndirim Kodu</h3>
                                <div className="flex gap-2">
                                    <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="İndirim kodu" className="flex-1 border border-gray-300 rounded-md py-2.5 px-3" />
                                    <button type="button" onClick={handleCouponApply} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md">Uygula</button>
                                </div>
                                {couponDiscount > 0 && (
                                    <div className="mt-2 flex items-center gap-2">
                                        <span className="bg-gray-200 px-2 py-1 rounded-full text-xs">{couponCode}</span>
                                        <button type="button" onClick={() => { setCouponCode(''); setCouponDiscount(0); }} className="text-gray-400 hover:text-gray-600">×</button>
                                    </div>
                                )}
                            </div>

                            {/* Payment */}
                            <div className="bg-white p-4 rounded-lg border">
                                <h3 className="font-medium mb-4">Ödeme Yöntemi</h3>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                                        <input type="radio" name="method" value="KAPIDA" checked={method === 'KAPIDA'} onChange={() => setMethod('KAPIDA')} className="w-4 h-4" />
                                        <span className="text-sm">Kapıda Ödeme</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                                        <input type="radio" name="method" value="HAVALE/EFT" checked={method === 'HAVALE/EFT'} onChange={() => setMethod('HAVALE/EFT')} className="w-4 h-4" />
                                        <span className="text-sm">Havale / EFT</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                                        <input type="radio" name="method" value="paytr" checked={method === 'paytr'} onChange={() => setMethod('paytr')} className="w-4 h-4" />
                                        <span className="text-sm">Kredi/Banka Kartı</span>
                                    </label>
                                </div>
                                
                                {method === "HAVALE/EFT" && bankInfo && (
                                    <div className="mt-4 border p-3 text-sm">
                                        <p className="font-semibold mb-1">HAVALE / EFT BİLGİLERİ</p>
                                        <p>Hesap Adı: {bankInfo.accountName}</p>
                                        <p>Banka: {bankInfo.bankName}</p>
                                        <p>IBAN: {bankInfo.iban}</p>
                                    </div>
                                )}
                                {method === "KAPIDA" && (
                                    <div className="mt-3 border p-3 text-sm text-orange-600">Kapıda ödeme ek ücreti: 10₺ eklenecektir.</div>
                                )}
                            </div>

                            <button type="submit" className="w-full bg-black text-white px-6 py-4 rounded-md font-medium hover:bg-gray-800 transition">
                                Siparişi Tamamla
                            </button>
                        </div>

                        {/* RIGHT: SUMMARY */}
                        <div>
                            <OrderSummary deliveryFee={deliveryFee} couponDiscount={couponDiscount} />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default PlaceOrder;
