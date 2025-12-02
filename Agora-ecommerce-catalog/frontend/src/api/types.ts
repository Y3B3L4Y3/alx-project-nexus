// ============================================
// AGORA E-COMMERCE API TYPES
// ============================================

// Product Types
export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  thumbnail: string;
  rating: number;
  reviewCount: number;
  stock: number;
  category: string;
  categorySlug: string;
  brand: string;
  tags: string[];
  colors?: string[];
  sizes?: string[];
  specifications?: Record<string, string>;
  isNew?: boolean;
  isFeatured?: boolean;
  createdAt: string;
}

export interface ProductReview {
  id: number;
  productId: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  helpful: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  productCount: number;
}

// Cart Types
export interface CartItem {
  id: number;
  productId: number;
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  couponCode?: string;
  discount?: number;
}

// Wishlist Types
export interface WishlistItem {
  id: number;
  productId: number;
  product: Product;
  addedAt: string;
}

// User Types
export interface Address {
  id: number;
  name: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: number;
  type: 'visa' | 'mastercard' | 'paypal' | 'amex';
  lastFour: string;
  expiryDate: string;
  isDefault: boolean;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  createdAt: string;
}

// Order Types
export interface OrderItem {
  id: number;
  productId: number;
  product: Product;
  quantity: number;
  price: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Order {
  id: number;
  orderId: string;
  userId: number;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress: Address;
  billingAddress: Address;
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

// Contact Types
export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Filter Types
export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  brand?: string;
  sortBy?: 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'popular';
  search?: string;
}

