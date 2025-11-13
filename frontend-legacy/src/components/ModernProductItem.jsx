import React, { useState } from 'react';
import { useContext } from 'react';
import { ShopContext } from "../context/ShopContext.jsx";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import QuickPurchaseModal from "./QuickPurchaseModal.jsx";

/**
 * ModernProductItem - Enhanced product card with quick purchase
 *
 * Features:
 * - Quick purchase modal integration
 * - Better hover effects
 * - Product badges and labels
 * - Add to cart functionality
 * - Wishlist support (future)
 * - Mobile responsive
 */
const ModernProductItem = ({
  id,
  image,
  name,
  price,
  freshType,
  packaging,
  giftWrap,
  labels,
  sizes = [],
  onQuickBuy,
  showQuickBuy = true
}) => {
  const { currency, addToCart, cartItems, token } = useContext(ShopContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showCartSuccess, setShowCartSuccess] = useState(false);

  // Get first available size or use default
  const defaultSize = sizes.length > 0 ? sizes[0] : '';

  const handleQuickBuy = () => {
    if (!token) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }
    setIsModalOpen(true);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      window.location.href = '/login';
      return;
    }

    if (sizes.length === 0) return;

    setIsAddingToCart(true);

    try {
      await addToCart(id, defaultSize, 1);
      setShowCartSuccess(true);
      setTimeout(() => setShowCartSuccess(false), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const isInCart = () => {
    if (!defaultSize) return false;
    return cartItems[id]?.[defaultSize] > 0;
  };

  const getCartQuantity = () => {
    if (!defaultSize) return 0;
    return cartItems[id]?.[defaultSize] || 0;
  };

  return (
    <>
      <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
        {/* Product Image Container */}
        <Link to={`/product/${id}`} className="block">
          <div className="relative overflow-hidden aspect-square">
            <img
              src={image[0]}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
            />

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />

            {/* Product Badges */}
            <div className="absolute top-2 left-2 flex gap-1 flex-wrap z-10">
              {freshType && (
                <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                  {freshType === 'taze' ? '🍃 Taze' : '✨ Kuru'}
                </span>
              )}
              {packaging === 'özel' && (
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">🎁 Özel</span>
              )}
              {giftWrap && (
                <span className="px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded-full font-medium">🎀</span>
              )}
              {labels && labels.length > 0 && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                  {labels[0]}
                </span>
              )}
            </div>

            {/* Quick Actions */}
            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {/* Wishlist Button (Future) */}
              <button
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 transition-colors"
                aria-label="Add to wishlist"
              >
                <svg className="w-5 h-5 text-gray-600 hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>

              {/* Cart Status */}
              {isInCart() && (
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm font-bold">{getCartQuantity()}</span>
                </div>
              )}
            </div>
          </div>
        </Link>

        {/* Product Info */}
        <div className="p-4">
          <Link to={`/product/${id}`} className="block">
            <h3 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 mb-1">
              {name}
            </h3>
            {labels && labels.length > 0 && (
              <p className="text-xs text-gray-500 mb-2 line-clamp-1">{labels.join(', ')}</p>
            )}
          </Link>

          {/* Price */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-bold text-gray-900">{currency}{price}</span>
            {sizes.length > 0 && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {sizes.length} seçenek
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {showQuickBuy && sizes.length > 0 && (
              <button
                onClick={handleQuickBuy}
                className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors transform hover:scale-105 duration-200 flex items-center justify-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Hızlı Satın Al
              </button>
            )}

            {sizes.length > 0 && (
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className={`
                  relative py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105
                  ${isAddingToCart
                    ? 'bg-gray-300 cursor-not-allowed'
                    : isInCart()
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {isAddingToCart ? (
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : isInCart() ? (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Sepette
                  </div>
                ) : (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Sepet
                  </div>
                )}
              </button>
            )}
          </div>

          {/* Success Message */}
          {showCartSuccess && (
            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-xs text-green-800 text-center font-medium">
                ✓ Sepete eklendi
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Purchase Modal */}
      <QuickPurchaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={{ id, image, name, price, sizes }}
        defaultSize={defaultSize}
        defaultQuantity={1}
      />
    </>
  );
};

ModernProductItem.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  image: PropTypes.array.isRequired,
  freshType: PropTypes.string,
  packaging: PropTypes.string,
  giftWrap: PropTypes.bool,
  labels: PropTypes.array,
  sizes: PropTypes.array,
  onQuickBuy: PropTypes.func,
  showQuickBuy: PropTypes.bool
};

export default ModernProductItem;