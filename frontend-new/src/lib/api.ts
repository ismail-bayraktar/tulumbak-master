// ============================================
// TULUMBAK E-TİCARET - Axios API Client
// ============================================

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import type {
  Product,
  Cart,
  Order,
  User,
  Coupon,
  DeliveryZone,
  DeliveryTimeSlot,
  Slider,
  ApiResponse,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  SiteSettings,
} from './types';

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4001';

// Create Axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 15000, // 15 seconds
});

// ============================================
// REQUEST INTERCEPTOR (JWT Token)
// ============================================
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers.token = token; // Backend uses 'token' header
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// ============================================
// RESPONSE INTERCEPTOR (Error Handling)
// ============================================
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle 401 Unauthorized (invalid/expired token)
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect to login page
        window.location.href = '/giris';
      }
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error.message);
    }

    return Promise.reject(error);
  }
);

// ============================================
// API ENDPOINTS
// ============================================

// --- AUTHENTICATION ---
export const authAPI = {
  login: (credentials: LoginCredentials) =>
    api.post<AuthResponse>('/api/user/login', credentials),

  register: (data: RegisterData) =>
    api.post<AuthResponse>('/api/user/register', data),

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.resolve();
  },

  getCurrentUser: () =>
    api.get<ApiResponse<User>>('/api/user/profile'),
};

// --- PRODUCTS ---
export const productAPI = {
  getAll: () =>
    api.get<ApiResponse<{ products: Product[] }>>('/api/product/list'),

  getById: (id: string) =>
    api.get<ApiResponse<{ product: Product }>>(`/api/product/${id}`),

  getByCategory: (category: string) =>
    api.get<ApiResponse<{ products: Product[] }>>(`/api/product/category/${category}`),

  search: (query: string) =>
    api.get<ApiResponse<{ products: Product[] }>>(`/api/product/search?q=${query}`),
};

// --- CART ---
export const cartAPI = {
  get: (userId: string) =>
    api.get<ApiResponse<Cart>>(`/api/cart/${userId}`),

  add: (data: { userId: string; productId: string; variant: any; quantity: number; packaging?: string; giftPackage?: boolean }) =>
    api.post<ApiResponse<Cart>>('/api/cart/add', data),

  update: (data: { userId: string; productId: string; quantity: number }) =>
    api.put<ApiResponse<Cart>>('/api/cart/update', data),

  remove: (data: { userId: string; productId: string }) =>
    api.delete<ApiResponse<Cart>>('/api/cart/remove', { data }),

  clear: (userId: string) =>
    api.delete<ApiResponse>(`/api/cart/clear/${userId}`),
};

// --- ORDERS ---
export const orderAPI = {
  create: (orderData: any) =>
    api.post<ApiResponse<Order>>('/api/order/place', orderData),

  getAll: (userId: string) =>
    api.get<ApiResponse<{ orders: Order[] }>>(`/api/order/user/${userId}`),

  getById: (orderId: string) =>
    api.get<ApiResponse<{ order: Order }>>(`/api/order/${orderId}`),

  cancel: (orderId: string) =>
    api.put<ApiResponse>(`/api/order/cancel/${orderId}`),
};

// --- COUPONS ---
export const couponAPI = {
  validate: (code: string) =>
    api.post<ApiResponse<Coupon>>('/api/coupon/validate', { code }),

  apply: (code: string, orderAmount: number) =>
    api.post<ApiResponse<{ discount: number; coupon: Coupon }>>('/api/coupon/apply', { code, orderAmount }),
};

// --- DELIVERY ---
export const deliveryAPI = {
  getZones: () =>
    api.get<ApiResponse<{ zones: DeliveryZone[] }>>('/api/delivery/zones'),

  getTimeSlots: (date?: string) =>
    api.get<ApiResponse<{ slots: DeliveryTimeSlot[] }>>(`/api/delivery/timeslots${date ? `?date=${date}` : ''}`),

  calculateFee: (district: string) =>
    api.post<ApiResponse<{ fee: number; zone: DeliveryZone }>>('/api/delivery/calculate', { district }),
};

// --- SLIDERS ---
export const sliderAPI = {
  getActive: () =>
    api.get<ApiResponse<{ sliders: Slider[] }>>('/api/slider/active'),
};

// --- SETTINGS ---
export const settingsAPI = {
  get: () =>
    api.get<ApiResponse<SiteSettings>>('/api/settings'),

  checkMaintenance: () =>
    api.get<ApiResponse<{ maintenanceMode: boolean }>>('/api/settings/maintenance-status'),
};

// --- PAYMENT (PayTR) ---
export const paymentAPI = {
  initiate: (orderData: any) =>
    api.post<ApiResponse<{ iframeToken: string }>>('/api/paytr/initiate', orderData),

  verify: (token: string) =>
    api.post<ApiResponse>('/api/paytr/verify', { token }),
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
  }).format(price);
};

export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '/assets/placeholder.png';

  // Cloudinary images
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // Local backend images
  return `${API_BASE_URL}/uploads/${imagePath}`;
};

export const handleApiError = (error: any): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.response?.data?.error || error.message;
  }
  return 'Bir hata oluştu. Lütfen tekrar deneyin.';
};

export default api;
