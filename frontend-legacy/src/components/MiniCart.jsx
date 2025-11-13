import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext.jsx';
import { toast } from 'react-toastify';

const MiniCart = () => {
  const {
    cartItems,
    products,
    currency,
    getCartCount,
    getCartAmount,
    getShippingFee,
    updateQuantity,
    navigate,
    token
  } = useContext(ShopContext);

  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Close mini cart when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.mini-cart-container')) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close mini cart when pressing Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleOpen = () => {
    if (!token) {
      toast.error('Sepeti görüntülemek için lütfen giriş yapın.');
      navigate('/login');
      return;
    }
    setIsOpen(true);
    setIsAnimating(true);
  };

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => setIsOpen(false), 300);
  };

  const handleQuantityChange = async (itemId, size, newQuantity) => {
    if (newQuantity === 0) {
      setIsUpdating(true);
      // Handle item removal
      await updateQuantity(itemId, size, 0);
      setIsUpdating(false);
      toast.success('Ürün sepetten kaldırıldı.');
    } else {
      setIsUpdating(true);
      await updateQuantity(itemId, size, newQuantity);
      setIsUpdating(false);
    }
  };

  const handleCheckout = () => {
    handleClose();
    navigate('/place-order');
  };

  const cartCount = getCartCount();
  const cartAmount = getCartAmount();
  const shippingFee = getShippingFee();
  const totalAmount = cartAmount + shippingFee;

  // Calculate items for display
  const cartItemsArray = [];
  for (const itemId in cartItems) {
    for (const size in cartItems[itemId]) {
      if (cartItems[itemId][size] > 0) {
        const product = products.find(p => p._id === itemId);
        if (product) {
          cartItemsArray.push({
            ...product,
            size,
            quantity: cartItems[itemId][size]
          });
        }
      }
    }
  }

  // Free shipping threshold
  const freeShippingThreshold = 3000;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartAmount);

  return (
    <div className="mini-cart-container relative">
      {/* Cart Button */}
      <button
        onClick={handleOpen}
        className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors group"
      >
        <svg className="w-6 h-6 text-gray-700 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
            {cartCount > 99 ? '99+' : cartCount}
          </span>
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
            isAnimating ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={handleClose}
        />
      )}

      {/* Mini Cart Panel */}
      {isOpen && (
        <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          isAnimating ? 'translate-x-0' : 'translate-x-full'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Sepetiniz ({cartCount})</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex flex-col h-full">
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cartItemsArray.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Sepetiniz Boş</h3>
                  <p className="text-gray-600 mb-6">Henüz ürün eklemediniz.</p>
                  <Link
                    to="/collection"
                    onClick={handleClose}
                    className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Alışverişe Başla
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItemsArray.map((item) => (
                    <div key={`${item._id}-${item.size}`} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-20 h-20 flex-shrink-0">
                        <img
                          src={item.image[0]}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{item.size} kg</p>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-900">
                            ₺{(item.basePrice * item.quantity).toFixed(2)}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleQuantityChange(item._id, item.size, item.quantity - 1)}
                              disabled={isUpdating}
                              className="w-8 h-8 rounded-lg bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item._id, item.size, item.quantity + 1)}
                              disabled={isUpdating}
                              className="w-8 h-8 rounded-lg bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItemsArray.length > 0 && (
              <div className="border-t border-gray-200 p-6 space-y-4">
                {/* Free Shipping Progress */}
                {remainingForFreeShipping > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-green-800 font-medium">
                        Ücretsiz kargo yaklaşıyor!
                      </span>
                      <span className="text-sm text-green-600">
                        ₺{remainingForFreeShipping.toFixed(2)} kaldı
                      </span>
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (cartAmount / freeShippingThreshold) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Order Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ara Toplam</span>
                    <span className="font-medium">₺{cartAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Kargo</span>
                    <span className="font-medium">
                      {shippingFee === 0 ? 'Ücretsiz' : `₺${shippingFee.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Toplam</span>
                      <span className="font-bold text-lg text-gray-900">₺{totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    Ödemeye Geç
                    <svg className="w-4 h-4 inline ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                  <Link
                    to="/cart"
                    onClick={handleClose}
                    className="block w-full text-center py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Sepeti Görüntüle
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniCart;