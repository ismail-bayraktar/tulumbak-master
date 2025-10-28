import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

/**
 * ModernOrderSummary - Enhanced order summary with better UX
 *
 * Features:
 * - Modern design with animations
 * - Enhanced coupon system
 * - Better price breakdown
 * - Mobile responsive
 * - Loading states
 */
const ModernOrderSummary = ({
  deliveryFee = 0,
  couponDiscount = 0,
  couponCode = '',
  setCouponCode,
  setCouponDiscount,
  handleCouponApply,
  method,
  setMethod,
  bankInfo,
  isSubmitting = false
}) => {
  const { cartItems, products, currency } = useContext(ShopContext);
  const [couponLoading, setCouponLoading] = useState(false);
  const [showCouponSuccess, setShowCouponSuccess] = useState(false);

  // Calculate cart amount
  let cartAmount = 0;
  const cartItemsArray = [];

  Object.entries(cartItems).forEach(([productId, sizes]) => {
    const product = products.find(p => p._id === productId);
    if (!product) return;

    Object.entries(sizes).forEach(([size, quantity]) => {
      if (quantity > 0) {
        const sizePrice = product.sizePrices?.find(sp => sp.size === size);
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
  const tax = subtotal * 0.08; // 8% tax
  const processingFee = method === 'KAPIDA' ? 10 : 0;
  const finalTotal = subtotal + tax + deliveryFee + processingFee - couponDiscount;

  const handleCouponClick = async () => {
    if (!couponCode.trim()) return;

    setCouponLoading(true);
    try {
      await handleCouponApply();
      setShowCouponSuccess(true);
      setTimeout(() => setShowCouponSuccess(false), 3000);
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setCouponDiscount(0);
    setShowCouponSuccess(false);
  };

  return (
    <div className="sticky top-4 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
        <h3 className="text-lg font-semibold text-white">Sipariş Özeti</h3>
      </div>

      <div className="p-6 space-y-6">
        {/* Cart Items */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Ürünler</h4>
          {cartItemsArray.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="relative flex-shrink-0">
                <img
                  src={item.product.image[0]}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                />
                <div className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md">
                  {item.quantity}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{item.product.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.size}</p>
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {currency}{(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* Coupon Section */}
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">İndirim Kodu</h4>

          {couponDiscount > 0 ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span className="text-sm font-medium text-green-800">{couponCode}</span>
                </div>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-green-600 hover:text-green-800 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-green-700 mt-1">
                {currency}{couponDiscount.toFixed(2)} indirim uygulandı
              </p>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="İndirim kodunu giriniz"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                disabled={couponLoading}
              />
              <button
                type="button"
                onClick={handleCouponClick}
                disabled={couponLoading || !couponCode.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                {couponLoading ? (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'Uygula'
                )}
              </button>
            </div>
          )}

          {showCouponSuccess && (
            <div className="mt-2 text-xs text-green-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              İndirim kodu başarıyla uygulandı!
            </div>
          )}
        </div>

        {/* Price Breakdown */}
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Fiyat Detayları</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Ara Toplam</span>
              <span className="text-gray-900">{currency}{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">KDV (%8)</span>
              <span className="text-gray-900">{currency}{tax.toFixed(2)}</span>
            </div>

            {deliveryFee > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Teslimat Ücreti</span>
                <span className="text-gray-900">{currency}{deliveryFee.toFixed(2)}</span>
              </div>
            )}

            {processingFee > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Kapıda Ödeme Bedeli</span>
                <span className="text-orange-600 font-medium">{currency}{processingFee.toFixed(2)}</span>
              </div>
            )}

            {couponDiscount > 0 && (
              <div className="flex justify-between">
                <span className="text-green-600 flex items-center">
                  İndirim
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </span>
                <span className="text-green-600 font-medium">-{currency}{couponDiscount.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Total */}
        <div className="border-t-2 border-gray-300 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900">Toplam</span>
            <span className="text-2xl font-bold text-red-600">{currency}{finalTotal.toFixed(2)}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1 text-center">KDV dahil</p>
        </div>

        {/* Trust Badges */}
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center">
              <svg className="w-6 h-6 text-green-600 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-xs text-gray-600">Güvenli Ödeme</span>
            </div>
            <div className="flex flex-col items-center">
              <svg className="w-6 h-6 text-blue-600 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-xs text-gray-600">Hızlı Teslimat</span>
            </div>
            <div className="flex flex-col items-center">
              <svg className="w-6 h-6 text-purple-600 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-xs text-gray-600">Taze Ürün</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transform hover:scale-[1.02] transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              İşleniyor...
            </div>
          ) : (
            'Siparişi Tamamla'
          )}
        </button>
      </div>
    </div>
  );
};

ModernOrderSummary.propTypes = {
  deliveryFee: PropTypes.number,
  couponDiscount: PropTypes.number,
  couponCode: PropTypes.string,
  setCouponCode: PropTypes.func.isRequired,
  setCouponDiscount: PropTypes.func.isRequired,
  handleCouponApply: PropTypes.func.isRequired,
  method: PropTypes.string.isRequired,
  setMethod: PropTypes.func.isRequired,
  bankInfo: PropTypes.object,
  isSubmitting: PropTypes.bool
};

export default ModernOrderSummary;