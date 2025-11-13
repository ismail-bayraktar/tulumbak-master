import { create } from 'zustand';
import { CartState, CartItems } from '@/types/cart';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { useProductStore } from './productStore';

export const useCartStore = create<CartState>((set, get) => ({
  items: {},
  currency: '₺',
  deliveryFee: 90,

  addToCart: (itemId: string, size: string) => {
    const items = { ...get().items };

    if (items[itemId]) {
      if (items[itemId][size]) {
        items[itemId][size] += 1;
      } else {
        items[itemId][size] = 1;
      }
    } else {
      items[itemId] = { [size]: 1 };
    }

    set({ items });
  },

  updateQuantity: (itemId: string, size: string, quantity: number) => {
    const items = { ...get().items };

    if (quantity <= 0) {
      get().removeFromCart(itemId, size);
      return;
    }

    if (items[itemId]) {
      items[itemId][size] = quantity;
      set({ items });
    }
  },

  removeFromCart: (itemId: string, size: string) => {
    const items = { ...get().items };

    if (items[itemId]) {
      delete items[itemId][size];
      if (Object.keys(items[itemId]).length === 0) {
        delete items[itemId];
      }
    }

    set({ items });
  },

  getCartCount: () => {
    const items = get().items;
    let totalCount = 0;

    for (const productId in items) {
      for (const size in items[productId]) {
        totalCount += items[productId][size];
      }
    }

    return totalCount;
  },

  getCartAmount: () => {
    const items = get().items;
    const products = useProductStore.getState().products;
    let totalAmount = 0;

    for (const productId in items) {
      const product = products.find(p => p._id === productId);
      if (!product) continue;

      for (const size in items[productId]) {
        const quantity = items[productId][size];
        const sizePrice = product.sizePrices.find(sp => sp.size === Number(size));
        const price = sizePrice ? sizePrice.price : product.basePrice;
        totalAmount += price * quantity;
      }
    }

    return totalAmount;
  },

  getShippingFee: () => {
    const amount = get().getCartAmount();
    const minimumForFreeShipping = 1000;
    return amount >= minimumForFreeShipping ? 0 : get().deliveryFee;
  },

  clearCart: () => {
    set({ items: {} });
  },

  syncWithBackend: async (token: string) => {
    if (!token) return;

    try {
      const response = await apiClient.post(API_ENDPOINTS.CART.GET, {});

      if (response.data.success && response.data.cartData) {
        set({ items: response.data.cartData });
      }
    } catch (error) {
      console.error('Cart sync error:', error);
    }
  },
}));
