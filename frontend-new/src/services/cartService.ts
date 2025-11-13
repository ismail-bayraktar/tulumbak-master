import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { CartItems } from '@/types/cart';

interface CartResponse {
  success: boolean;
  message?: string;
  cartData?: CartItems;
}

export const cartService = {
  /**
   * Add item to cart on backend
   */
  async addToCart(itemId: string, size: string): Promise<CartResponse> {
    const response = await apiClient.post<CartResponse>(
      API_ENDPOINTS.CART.ADD,
      { itemId, size }
    );
    return response.data;
  },

  /**
   * Update cart item quantity on backend
   */
  async updateCart(itemId: string, size: string, quantity: number): Promise<CartResponse> {
    const response = await apiClient.post<CartResponse>(
      API_ENDPOINTS.CART.UPDATE,
      { itemId, size, quantity }
    );
    return response.data;
  },

  /**
   * Get user's cart from backend
   */
  async getCart(): Promise<CartResponse> {
    const response = await apiClient.post<CartResponse>(
      API_ENDPOINTS.CART.GET,
      {}
    );
    return response.data;
  },

  /**
   * Sync local cart with backend
   */
  async syncCart(cartData: CartItems): Promise<CartResponse> {
    try {
      const response = await apiClient.post<CartResponse>(
        API_ENDPOINTS.CART.UPDATE,
        { cartData }
      );
      return response.data;
    } catch (error) {
      return { success: false, message: 'Cart sync failed' };
    }
  },
};
