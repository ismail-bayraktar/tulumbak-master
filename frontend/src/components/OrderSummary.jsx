import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

const OrderSummary = ({ deliveryFee = 0, couponDiscount = 0, couponCode = '', setCouponCode, setCouponDiscount, handleCouponApply, method, setMethod, bankInfo }) => {
    const { cartItems, products, currency } = useContext(ShopContext);
    
    // Calculate cart amount
    let cartAmount = 0;
    const cartItemsArray = [];
    
    Object.entries(cartItems).forEach(([productId, sizes]) => {
        const product = products.find(p => p._id === productId);
        if (!product) return;
        
        Object.entries(sizes).forEach(([size, quantity]) => {
            if (quantity > 0) {
                const sizePrice = product.sizePrices.find(sp => sp.size === size);
                const price = sizePrice?.price ?? product.basePrice;
                cartAmount += price * quantity;
                
                cartItemsArray.push({
                    product,
                    size,
                    quantity,
                    price
                });
            }
        });
    });
    
    const subtotal = cartAmount;
    const finalTotal = subtotal + deliveryFee - couponDiscount;
    
    return (
        <div>
            {/* Ürünler */}
            <div className="space-y-4 mb-6">
                {cartItemsArray.map((item, idx) => (
                    <div key={idx} className="flex gap-3">
                        <div className="relative">
                            <img src={item.product.image[0]} alt={item.product.name} className="w-16 h-16 object-cover rounded" />
                            <div className="absolute -top-2 -right-2 bg-gray-400 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                {item.quantity}
                            </div>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium">{item.product.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{item.size}</p>
                        </div>
                        <div className="text-sm font-medium">
                            {currency}{item.price.toFixed(2)}
                        </div>
                    </div>
                ))}
            </div>

            {/* İndirim Kodu */}
            <div className="mb-6">
                {couponDiscount > 0 ? (
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-xs">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            {couponCode}
                        </span>
                        <button 
                            type="button" 
                            onClick={() => { setCouponCode(''); setCouponDiscount(0); }}
                            className="text-gray-400 hover:text-gray-600 text-sm"
                        >
                            ×
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder="İndirim kodu" 
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            className="flex-1 border border-gray-300 rounded-md py-2 px-3 text-sm"
                        />
                        <button 
                            type="button" 
                            onClick={handleCouponApply}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium"
                        >
                            Uygula
                        </button>
                    </div>
                )}
            </div>

            {/* Fiyat Detayları */}
            <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                    <span className="text-gray-600">Ara Toplam</span>
                    <span className="text-gray-800">{currency}{subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                    <span className="text-gray-600">Kargo</span>
                    <span className="text-gray-400">Bir sonraki adımda hesaplanacak</span>
                </div>
                
                {couponDiscount > 0 && (
                    <div className="flex justify-between">
                        <span className="text-gray-600">
                            İndirim{' '}
                            {couponCode && (
                                <span className="inline-flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    <span className="font-medium">{couponCode}</span>
                                </span>
                            )}
                        </span>
                        <span className="text-green-600">-{currency}{couponDiscount.toFixed(2)}</span>
                    </div>
                )}
                
                <div className="flex justify-between">
                    <span className="text-gray-600">Vergi</span>
                    <span className="text-gray-800">{currency}5.00</span>
                </div>
            </div>

            {/* Toplam */}
            <div className="border-t pt-3 mt-4">
                <div className="flex justify-between font-bold text-base">
                    <span>Toplam</span>
                    <span>{currency}{finalTotal.toFixed(2)}</span>
                </div>
            </div>

            {/* Ödeme Yöntemi */}
            <div className="mt-6 border-t pt-6">
                <h3 className="font-medium mb-4 text-sm">Ödeme Yöntemi</h3>
                <div className="space-y-2 text-sm">
                    <label className="flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                        <input type="radio" name="method" value="HAVALE/EFT" checked={method === 'HAVALE/EFT'} onChange={() => setMethod('HAVALE/EFT')} className="w-4 h-4" />
                        <span>Havale / EFT</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                        <input type="radio" name="method" value="KAPIDA" checked={method === 'KAPIDA'} onChange={() => setMethod('KAPIDA')} className="w-4 h-4" />
                        <span>Kapıda Ödeme</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                        <input type="radio" name="method" value="paytr" checked={method === 'paytr'} onChange={() => setMethod('paytr')} className="w-4 h-4" />
                        <span>Kredi/Banka Kartı</span>
                    </label>
                </div>
                
                {method === "HAVALE/EFT" && bankInfo && (
                    <div className="mt-3 p-3 bg-gray-50 border rounded-md text-xs">
                        <p className="font-semibold mb-1">HAVALE / EFT BİLGİLERİ</p>
                        <p>Hesap Adı: {bankInfo.accountName}</p>
                        <p>Banka: {bankInfo.bankName}</p>
                        <p>IBAN: {bankInfo.iban}</p>
                    </div>
                )}
                {method === "KAPIDA" && (
                    <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-md text-xs text-orange-700">
                        Kapıda ödeme ek ücreti: 10₺ eklenecektir.
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderSummary;

