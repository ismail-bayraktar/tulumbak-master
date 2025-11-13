import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';

/**
 * QuickPurchaseModal - Fast purchase modal for products
 *
 * Features:
 * - Product selection and quantity
 * - Quick delivery options
 * - Express checkout flow
 * - Mobile responsive
 * - Smooth animations
 */
const QuickPurchaseModal = ({
  isOpen,
  onClose,
  product = null,
  defaultSize = '',
  defaultQuantity = 1
}) => {
  const { addToCart, navigate, token, currency } = useContext(ShopContext);

  const [selectedSize, setSelectedSize] = useState(defaultSize);
  const [quantity, setQuantity] = useState(defaultQuantity);
  const [selectedDelivery, setSelectedDelivery] = useState('standard');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Reset form when product changes
  useEffect(() => {
    if (product) {
      setSelectedSize(defaultSize || (product.sizes?.[0] || ''));
      setQuantity(defaultQuantity);
      setSelectedDelivery('standard');
      setShowSuccess(false);
    }
  }, [product, defaultSize, defaultQuantity]);

  if (!isOpen || !product) return null;

  // Calculate prices
  const sizePrice = product.sizePrices?.find(sp => sp.size === selectedSize);
  const unitPrice = sizePrice?.price ?? product.basePrice;
  const totalPrice = unitPrice * quantity;

  // Delivery options
  const deliveryOptions = [
    {
      id: 'standard',
      name: 'Standart Teslimat',
      description: '2-3 iş günü içinde',
      price: 0,
      icon: '📦'
    },
    {
      id: 'express',
      name: 'Hızlı Teslimat',
      description: 'Bugün (14:00 öncesi)',
      price: 15,
      icon: '🚀'
    },
    {
      id: 'scheduled',
      name: 'Planlı Teslimat',
      description: 'İstediğiniz gün',
      price: 5,
      icon: '📅'
    }
  ];

  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!token) {
      navigate('/login');
      onClose();
      return;
    }

    setIsAddingToCart(true);

    try {
      await addToCart(product._id, selectedSize, quantity);
      setShowSuccess(true);

      // Close modal after success
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleQuickCheckout = () => {
    if (!token) {
      navigate('/login');
      onClose();
      return;
    }

    // Add to cart and navigate to checkout
    addToCart(product._id, selectedSize, quantity);
    onClose();
    navigate('/place-order');
  };

  const selectedDeliveryOption = deliveryOptions.find(opt => opt.id === selectedDelivery);
  const deliveryFee = selectedDeliveryOption?.price || 0;
  const finalTotal = totalPrice + deliveryFee;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/80 p-2 text-gray-500 hover:bg-white hover:text-gray-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
            <h3 className="text-lg font-semibold text-white">Hızlı Satın Alma</h3>
            <p className="text-red-100 text-sm mt-1">Sadece birkaç adımda sipariş verin</p>
          </div>

          {/* Product Info */}
          <div className="p-6">
            <div className="flex items-start gap-4 mb-6">
              <img
                src={product.image[0]}
                alt={product.name}
                className="w-20 h-20 object-cover rounded-lg border border-gray-200"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{product.name}</h4>
                <p className="text-sm text-gray-500 mt-1">{product.description}</p>
                <p className="text-lg font-bold text-red-600 mt-2">
                  {currency}{unitPrice.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Boyut Seçimi
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSizeChange(size)}
                      className={`py-2 px-4 rounded-lg border-2 transition-all duration-200 font-medium ${
                        selectedSize === size
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adet
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>

                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val >= 1 && val <= 10) {
                      setQuantity(val);
                    }
                  }}
                  className="w-16 h-10 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  min="1"
                  max="10"
                />

                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= 10}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Delivery Options */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teslimat Seçeneği
              </label>
              <div className="space-y-2">
                {deliveryOptions.map((option) => (
                  <label
                    key={option.id}
                    className={`
                      flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200
                      ${selectedDelivery === option.id
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      value={option.id}
                      checked={selectedDelivery === option.id}
                      onChange={() => setSelectedDelivery(option.id)}
                      className="w-4 h-4 text-red-600 focus:ring-red-500"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">{option.icon}</span>
                        <div>
                          <div className="font-medium text-gray-900">{option.name}</div>
                          <div className="text-sm text-gray-500">{option.description}</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-medium">
                      {option.price > 0 ? `+${currency}${option.price}` : 'Ücretsiz'}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ürün Fiyatı</span>
                  <span>{currency}{totalPrice.toFixed(2)}</span>
                </div>
                {deliveryFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Teslimat</span>
                    <span>{currency}{deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-base pt-2 border-t">
                  <span>Toplam</span>
                  <span className="text-red-600">{currency}{finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Success Message */}
            {showSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center text-green-800">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium">Ürün sepete eklendi!</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleQuickCheckout}
                disabled={isAddingToCart}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transform hover:scale-[1.02] transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Hızlı Ödeme
              </button>

              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart || showSuccess}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingToCart ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Ekleniyor...
                  </div>
                ) : (
                  'Sepete Ekle'
                )}
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-4 flex items-center justify-center space-x-6 text-xs text-gray-500">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Güvenli
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Hızlı
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Kaliteli
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

QuickPurchaseModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.object,
  defaultSize: PropTypes.string,
  defaultQuantity: PropTypes.number
};

export default QuickPurchaseModal;