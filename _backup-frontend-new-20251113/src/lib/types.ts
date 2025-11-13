// ============================================
// TULUMBAK E-TİCARET - TypeScript Type Definitions
// ============================================

// Product Types
export interface ProductVariant {
  weight: '250g' | '500g' | '1kg' | '2kg';
  freshness: 'Taze' | 'Kuru';
  price: number;
  _id?: string;
}

export interface PackagingOption {
  options: string[];
  prices: number[];
}

export interface GiftPackage {
  available: boolean;
  price: number;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  variants: ProductVariant[];
  images: string[];
  packaging: PackagingOption;
  giftPackage: GiftPackage;
  tags: string[];
  stock: boolean;
  bestseller: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Cart Types
export interface CartItem {
  productId: string;
  product?: Product; // Populated product data
  variant: ProductVariant;
  quantity: number;
  packaging?: string;
  giftPackage?: boolean;
  totalPrice: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  totalAmount: number;
  createdAt?: string;
  updatedAt?: string;
}

// Order Types
export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
export type PaymentMethod = 'Havale/EFT' | 'Kapıda Ödeme' | 'Online Ödeme';
export type PaymentStatus = 'Pending' | 'Completed' | 'Failed';

export interface DeliveryAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  postalCode?: string;
  notes?: string;
}

export interface Order {
  _id: string;
  userId: string;
  orderNumber: string;
  items: CartItem[];
  deliveryAddress: DeliveryAddress;
  deliveryZone?: string;
  deliveryTimeSlot?: string;
  deliveryFee: number;
  couponCode?: string;
  discount: number;
  subtotal: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  notes?: string;
  courierInfo?: {
    trackingNumber?: string;
    courierName?: string;
    estimatedDelivery?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  addresses?: DeliveryAddress[];
  createdAt?: string;
  updatedAt?: string;
}

// Coupon Types
export interface Coupon {
  _id: string;
  code: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  active: boolean;
}

// Delivery Types
export interface DeliveryZone {
  _id: string;
  name: string;
  fee: number;
  minOrderAmount: number;
  districts: string[];
  active: boolean;
}

export interface DeliveryTimeSlot {
  _id: string;
  timeRange: string;
  available: boolean;
  maxOrders?: number;
  currentOrders?: number;
}

// Slider Types
export interface Slider {
  _id: string;
  template: 'split-left' | 'split-right' | 'full-width' | 'centered';
  title: string;
  subtitle?: string;
  description: string;
  buttonText?: string;
  buttonLink?: string;
  buttonStyle?: 'primary' | 'secondary' | 'outline';
  image: string;
  overlayOpacity: number;
  textColor: 'auto' | 'light' | 'dark';
  viewCount: number;
  clickCount: number;
  altText?: string;
  seoTitle?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

// Settings Types
export interface SiteSettings {
  maintenanceMode: boolean;
  minOrderAmount: number;
  freeShippingThreshold?: number;
  whatsappNumber?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}
