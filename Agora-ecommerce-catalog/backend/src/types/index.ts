import { Request } from 'express';

// User types
export type UserRole = 'customer' | 'admin' | 'moderator' | 'editor' | 'viewer' | 'super_admin';
export type UserStatus = 'active' | 'suspended' | 'deleted';

export interface User {
  id: number;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  email_verified: boolean;
  created_at: Date;
  updated_at?: Date;
}

export interface UserPublic {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  createdAt: string;
}

// JWT types
export interface JwtAccessPayload {
  userId: number;
  email: string;
  role: UserRole;
}

export interface JwtRefreshPayload {
  userId: number;
  tokenId: string;
}

// Extended Request with user
export interface AuthRequest extends Request {
  user?: JwtAccessPayload;
}

// Product types
export type ProductStatus = 'active' | 'draft' | 'deleted';

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price?: number;
  discount: number;
  thumbnail: string;
  rating: number;
  review_count: number;
  stock: number;
  category_id: number;
  brand: string;
  tags?: string[];
  colors?: string[];
  sizes?: string[];
  specifications?: Record<string, string>;
  is_new: boolean;
  is_featured: boolean;
  status: ProductStatus;
  created_at: Date;
  updated_at?: Date;
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  sort_order: number;
}

// Category types
export interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  parent_id?: number;
  created_at: Date;
}

// Address types
export interface Address {
  id: number;
  user_id: number;
  name: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  is_default: boolean;
}

// Payment method types
export type PaymentType = 'visa' | 'mastercard' | 'paypal' | 'amex';

export interface PaymentMethod {
  id: number;
  user_id: number;
  type: PaymentType;
  last_four: string;
  expiry_date: string;
  token: string;
  is_default: boolean;
}

// Order types
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Order {
  id: number;
  order_id: string;
  user_id: number;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  status: OrderStatus;
  payment_method: string;
  payment_status: PaymentStatus;
  shipping_address_id: number;
  billing_address_id: number;
  tracking_number?: string;
  estimated_delivery?: Date;
  notes?: string;
  created_at: Date;
  updated_at?: Date;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  selected_color?: string;
  selected_size?: string;
}

// Review types
export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  title: string;
  comment: string;
  helpful: number;
  verified_purchase: boolean;
  created_at: Date;
}

// Wishlist types
export interface WishlistItem {
  id: number;
  user_id: number;
  product_id: number;
  added_at: Date;
}

// Cart types
export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  selected_color?: string;
  selected_size?: string;
  created_at: Date;
}

// Contact message types
export type MessageStatus = 'new' | 'read' | 'replied';
export type MessagePriority = 'low' | 'medium' | 'high';

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: MessageStatus;
  priority: MessagePriority;
  created_at: Date;
}

// Store settings types
export interface StoreSetting {
  id: number;
  key: string;
  value: string;
  updated_at?: Date;
}

// Refresh token types
export interface RefreshToken {
  id: number;
  user_id: number;
  token: string;
  expires_at: Date;
  created_at: Date;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: ValidationError[];
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

export interface ValidationError {
  field: string;
  message: string;
}

// Filter types
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

export interface PaginationParams {
  page: number;
  limit: number;
}

