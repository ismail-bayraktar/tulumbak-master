// API Endpoint Constants
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/api/user/login',
    REGISTER: '/api/user/register',
  },

  // Products
  PRODUCTS: {
    LIST: '/api/product/list',
    DETAIL: (id: string) => `/api/product/${id}`,
  },

  // Cart
  CART: {
    ADD: '/api/cart/add',
    UPDATE: '/api/cart/update',
    GET: '/api/cart/get',
  },

  // Orders
  ORDERS: {
    PLACE: '/api/order/place',
    USER_ORDERS: '/api/order/userorders',
    BANK_INFO: '/api/order/bank-info',
    UPDATE_PAYTR: '/api/order/update-paytr-order',
  },

  // Payment
  PAYMENT: {
    PAYTR_TOKEN: '/api/paytr/get-token',
    PAYTR_PAGE: '/paytr/payment',
  },

  // Settings & Configuration
  SETTINGS: {
    MAINTENANCE: '/api/settings/maintenance-status',
    DELIVERY_ZONES: '/api/delivery/zones',
    TIME_SLOTS: '/api/delivery/timeslots',
  },

  // Coupon
  COUPON: {
    VALIDATE: '/api/coupon/validate',
  },

  // Categories
  CATEGORIES: {
    ACTIVE: '/api/category/active',        // Public - aktif kategoriler
    LIST: '/api/category/list',            // Admin - tüm kategoriler
    SINGLE: '/api/category/single',        // Admin - tekil kategori
  },
} as const;
