import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { Order, PlaceOrderRequest } from '@/types/order';

interface OrderResponse {
  success: boolean;
  message?: string;
  order?: Order;
  orders?: Order[];
}

interface BankInfoResponse {
  success: boolean;
  message?: string;
  bankInfo?: {
    bankName: string;
    accountHolder: string;
    iban: string;
    accountNumber: string;
  };
}

export const orderService = {
  /**
   * Place new order
   */
  async placeOrder(orderData: PlaceOrderRequest): Promise<OrderResponse> {
    const response = await apiClient.post<OrderResponse>(
      API_ENDPOINTS.ORDERS.PLACE,
      orderData
    );
    return response.data;
  },

  /**
   * Get user's order history
   */
  async getUserOrders(): Promise<Order[]> {
    const response = await apiClient.post<OrderResponse>(
      API_ENDPOINTS.ORDERS.USER_ORDERS,
      {}
    );
    return response.data.orders || [];
  },

  /**
   * Get bank information for bank transfer payment
   */
  async getBankInfo(): Promise<BankInfoResponse> {
    const response = await apiClient.get<BankInfoResponse>(
      API_ENDPOINTS.ORDERS.BANK_INFO
    );
    return response.data;
  },

  /**
   * Update PayTR order status
   */
  async updatePaytrOrder(orderId: string, paymentStatus: boolean): Promise<OrderResponse> {
    const response = await apiClient.post<OrderResponse>(
      API_ENDPOINTS.ORDERS.UPDATE_PAYTR,
      { orderId, paymentStatus }
    );
    return response.data;
  },
};
