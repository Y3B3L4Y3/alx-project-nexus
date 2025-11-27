// ============================================
// MOCK API INDEX - EXPORT ALL MOCK DATA
// ============================================

// Types
export * from '../types';

// Products
export {
  mockProducts,
  mockCategories,
  mockReviews,
  getProductById,
  getProductsByCategory,
  getFeaturedProducts,
  getNewProducts,
  getRelatedProducts,
  searchProducts,
  getProductReviews,
} from './products';

// User & Orders
export {
  mockUser,
  mockOrders,
  getUserById,
  getUserOrders,
  getOrderById,
  getUserAddresses,
  getUserPaymentMethods,
  getOrdersByStatus,
} from './user';

