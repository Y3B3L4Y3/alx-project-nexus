// Mock data for testing

export const mockUser = {
  id: 1,
  email: 'test@example.com',
  password: 'Test@123',
  firstName: 'Test',
  lastName: 'User',
  phone: '+1234567890',
  role: 'customer' as const,
};

export const mockAdmin = {
  id: 2,
  email: 'admin@example.com',
  password: 'Admin@123',
  firstName: 'Admin',
  lastName: 'User',
  phone: '+0987654321',
  role: 'admin' as const,
};

export const mockProduct = {
  id: 1,
  name: 'Test Product',
  slug: 'test-product',
  description: 'A test product description',
  price: 99.99,
  originalPrice: 129.99,
  discount: 23,
  thumbnail: 'https://example.com/image.jpg',
  stock: 100,
  categoryId: 1,
  brand: 'Test Brand',
  tags: ['test', 'sample'],
  colors: ['#000000', '#FFFFFF'],
  sizes: ['S', 'M', 'L'],
  isNew: true,
  isFeatured: true,
};

export const mockCategory = {
  id: 1,
  name: 'Test Category',
  slug: 'test-category',
  icon: '📦',
  image: 'https://example.com/category.jpg',
};

export const mockAddress = {
  id: 1,
  userId: 1,
  name: 'John Doe',
  phone: '+1234567890',
  street: '123 Main St',
  apartment: 'Apt 4B',
  city: 'New York',
  state: 'NY',
  country: 'United States',
  zipCode: '10001',
  isDefault: true,
};

export const mockOrder = {
  id: 1,
  orderId: '#ORD-2024-001',
  userId: 1,
  items: [
    {
      productId: 1,
      quantity: 2,
      price: 99.99,
      selectedColor: '#000000',
      selectedSize: 'M',
    },
  ],
  subtotal: 199.98,
  shipping: 0,
  tax: 16.00,
  discount: 0,
  total: 215.98,
  status: 'pending' as const,
  paymentMethod: 'Visa •••• 4242',
  paymentStatus: 'pending' as const,
  shippingAddressId: 1,
  billingAddressId: 1,
};

export const mockReview = {
  id: 1,
  productId: 1,
  userId: 1,
  rating: 5,
  title: 'Great product!',
  comment: 'I love this product. Highly recommended!',
  helpful: 10,
  verifiedPurchase: true,
};

export const mockCartItem = {
  id: 1,
  userId: 1,
  productId: 1,
  quantity: 2,
  selectedColor: '#000000',
  selectedSize: 'M',
};

export const mockContactMessage = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  subject: 'Product Inquiry',
  message: 'I have a question about your products.',
  status: 'new' as const,
  priority: 'medium' as const,
};

// Helper to generate mock JWT tokens
export const mockTokens = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
};

// Helper to create authorization header
export const authHeader = (token: string = mockTokens.accessToken) => ({
  Authorization: `Bearer ${token}`,
});

