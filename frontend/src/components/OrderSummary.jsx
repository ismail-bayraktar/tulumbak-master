import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

const OrderSummary = ({ deliveryFee = 0, couponDiscount = 0 }) => {
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
        <div className="bg-white border rounded-lg overflow-hidden sticky top-4">
            <div className="p-4 bg-gray-50 border-b">
                <h2 className="text-lg font-semibold">Sipariş Özeti</h2>
            </div>
            
            <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
                {cartItemsArray.map((item, idx) => (
                    <div key={idx} className="flex gap-3">
                        <img src={item.product.image[0]} alt={item.product.name} className="w-16 h-16 object-cover rounded" />
                        <div className="flex-1">
                            <p className="font-medium text-sm">{item.product.name}</p>
                            <p className="text-sm text-gray-500">{item.size}</p>
                            <div className="flex justify-between mt-1">
                                <span className="text-sm text-gray-500">Adet: {item.quantity}</span>
                                <span className="text-sm font-medium">{currency}{item.price.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="p-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ara Toplam</span>
                    <span>{currency}{subtotal.toFixed(2)}</span>
                </div>
                
                {deliveryFee > 0 && (
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Kargo</span>
                        <span>{currency}{deliveryFee.toFixed(2)}</span>
                    </div>
                )}
                
                {couponDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                        <span>İndirim</span>
                        <span>-{currency}{couponDiscount.toFixed(2)}</span>
                    </div>
                )}
                
                <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-semibold text-base">
                        <span>Toplam</span>
                        <span>{currency}{finalTotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>
            
            <div className="p-4 bg-gray-50 border-t">
                <p className="text-xs text-gray-500">Ödeme sayfası güvenlidir. Bilgileriniz şifrelenir ve üçüncü kişilerle paylaşılmaz.</p>
            </div>
        </div>
    );
};

export default OrderSummary;

