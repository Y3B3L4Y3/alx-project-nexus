import type { User, Order, Address, PaymentMethod } from '../types';

// ============================================
// MOCK USER DATA
// ============================================

export const mockUser: User = {
  id: 1,
  firstName: 'Md',
  lastName: 'Rimel',
  email: 'rimel1111@gmail.com',
  phone: '+8801611112222',
  avatar: 'https://i.pravatar.cc/150?u=rimel',
  addresses: [
    {
      id: 1,
      name: 'Md Rimel',
      phone: '+8801611112222',
      street: 'House 123, Road 456',
      apartment: 'Apt 4B',
      city: 'Kingston',
      state: 'New York',
      country: 'United States',
      zipCode: '12401',
      isDefault: true,
    },
    {
      id: 2,
      name: 'Md Rimel (Office)',
      phone: '+8801699998888',
      street: '789 Business Ave',
      apartment: 'Floor 5, Suite 501',
      city: 'New York',
      state: 'New York',
      country: 'United States',
      zipCode: '10001',
      isDefault: false,
    },
  ],
  paymentMethods: [
    {
      id: 1,
      type: 'visa',
      lastFour: '4242',
      expiryDate: '12/25',
      isDefault: true,
    },
    {
      id: 2,
      type: 'mastercard',
      lastFour: '8888',
      expiryDate: '06/24',
      isDefault: false,
    },
    {
      id: 3,
      type: 'paypal',
      lastFour: '1234',
      expiryDate: 'N/A',
      isDefault: false,
    },
  ],
  createdAt: '2023-06-15T10:00:00Z',
};

// ============================================
// MOCK ORDERS DATA
// ============================================

export const mockOrders: Order[] = [
  {
    id: 1,
    orderId: '#ORD-2024-001',
    userId: 1,
    items: [
      {
        id: 1,
        productId: 1,
        product: {
          id: 1,
          name: 'HAVIT HV-G92 Gamepad',
          slug: 'havit-hv-g92-gamepad',
          description: 'High-quality wireless gamepad',
          price: 120,
          originalPrice: 160,
          discount: 25,
          images: ['https://images.unsplash.com/photo-1606318801954-d46d46d3360a?w=600'],
          thumbnail: 'https://images.unsplash.com/photo-1606318801954-d46d46d3360a?w=300',
          rating: 5,
          reviewCount: 88,
          stock: 45,
          category: 'Gaming',
          categorySlug: 'gaming',
          brand: 'HAVIT',
          tags: ['gamepad'],
          createdAt: '2024-01-15T10:00:00Z',
        },
        quantity: 2,
        price: 120,
        selectedColor: '#000000',
      },
      {
        id: 2,
        productId: 3,
        product: {
          id: 3,
          name: 'IPS LCD Gaming Monitor',
          slug: 'ips-lcd-gaming-monitor',
          description: '27-inch IPS LCD gaming monitor',
          price: 370,
          originalPrice: 400,
          discount: 8,
          images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600'],
          thumbnail: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300',
          rating: 5,
          reviewCount: 99,
          stock: 20,
          category: 'Electronics',
          categorySlug: 'electronics',
          brand: 'Samsung',
          tags: ['monitor'],
          createdAt: '2024-02-01T10:00:00Z',
        },
        quantity: 1,
        price: 370,
        selectedSize: '27"',
      },
    ],
    subtotal: 610,
    shipping: 0,
    tax: 48.80,
    discount: 0,
    total: 658.80,
    status: 'delivered',
    paymentMethod: 'Visa •••• 4242',
    paymentStatus: 'paid',
    shippingAddress: mockUser.addresses[0],
    billingAddress: mockUser.addresses[0],
    trackingNumber: 'TRK-123456789',
    estimatedDelivery: '2024-02-15',
    createdAt: '2024-02-01T14:30:00Z',
    updatedAt: '2024-02-10T09:00:00Z',
  },
  {
    id: 2,
    orderId: '#ORD-2024-002',
    userId: 1,
    items: [
      {
        id: 3,
        productId: 10,
        product: {
          id: 10,
          name: 'ASUS FHD Gaming Laptop',
          slug: 'asus-fhd-gaming-laptop',
          description: '15.6" FHD 144Hz gaming laptop',
          price: 700,
          originalPrice: 800,
          discount: 13,
          images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600'],
          thumbnail: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=300',
          rating: 5,
          reviewCount: 325,
          stock: 15,
          category: 'Electronics',
          categorySlug: 'electronics',
          brand: 'ASUS',
          tags: ['laptop'],
          createdAt: '2024-01-18T10:00:00Z',
        },
        quantity: 1,
        price: 700,
        selectedColor: '#000000',
      },
    ],
    subtotal: 700,
    shipping: 0,
    tax: 56.00,
    discount: 50,
    total: 706.00,
    status: 'shipped',
    paymentMethod: 'Mastercard •••• 8888',
    paymentStatus: 'paid',
    shippingAddress: mockUser.addresses[0],
    billingAddress: mockUser.addresses[0],
    trackingNumber: 'TRK-987654321',
    estimatedDelivery: '2024-02-20',
    createdAt: '2024-02-12T10:15:00Z',
    updatedAt: '2024-02-14T16:30:00Z',
  },
  {
    id: 3,
    orderId: '#ORD-2024-003',
    userId: 1,
    items: [
      {
        id: 4,
        productId: 5,
        product: {
          id: 5,
          name: 'Gucci Duffle Bag',
          slug: 'gucci-duffle-bag',
          description: 'Premium leather duffle bag',
          price: 960,
          originalPrice: 1160,
          discount: 17,
          images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600'],
          thumbnail: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300',
          rating: 5,
          reviewCount: 65,
          stock: 10,
          category: 'Fashion',
          categorySlug: 'fashion',
          brand: 'Gucci',
          tags: ['bag'],
          createdAt: '2024-01-20T10:00:00Z',
        },
        quantity: 1,
        price: 960,
        selectedColor: '#8B4513',
      },
    ],
    subtotal: 960,
    shipping: 0,
    tax: 76.80,
    discount: 0,
    total: 1036.80,
    status: 'processing',
    paymentMethod: 'PayPal',
    paymentStatus: 'paid',
    shippingAddress: mockUser.addresses[1],
    billingAddress: mockUser.addresses[0],
    estimatedDelivery: '2024-02-25',
    createdAt: '2024-02-15T08:45:00Z',
    updatedAt: '2024-02-15T08:45:00Z',
  },
  {
    id: 4,
    orderId: '#ORD-2024-004',
    userId: 1,
    items: [
      {
        id: 5,
        productId: 16,
        product: {
          id: 16,
          name: 'JBL Boombox 3 Speaker',
          slug: 'jbl-boombox-3-speaker',
          description: 'Powerful portable Bluetooth speaker',
          price: 350,
          images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600'],
          thumbnail: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300',
          rating: 5,
          reviewCount: 220,
          stock: 18,
          category: 'Electronics',
          categorySlug: 'electronics',
          brand: 'JBL',
          tags: ['speaker'],
          createdAt: '2024-02-12T10:00:00Z',
        },
        quantity: 1,
        price: 350,
        selectedColor: '#000000',
      },
    ],
    subtotal: 350,
    shipping: 0,
    tax: 28.00,
    discount: 0,
    total: 378.00,
    status: 'cancelled',
    paymentMethod: 'Visa •••• 4242',
    paymentStatus: 'refunded',
    shippingAddress: mockUser.addresses[0],
    billingAddress: mockUser.addresses[0],
    createdAt: '2024-02-08T11:20:00Z',
    updatedAt: '2024-02-09T14:00:00Z',
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export const getUserById = (id: number): User | undefined => {
  return id === mockUser.id ? mockUser : undefined;
};

export const getUserOrders = (userId: number): Order[] => {
  return mockOrders.filter(o => o.userId === userId);
};

export const getOrderById = (orderId: string): Order | undefined => {
  return mockOrders.find(o => o.orderId === orderId);
};

export const getUserAddresses = (userId: number): Address[] => {
  const user = getUserById(userId);
  return user?.addresses || [];
};

export const getUserPaymentMethods = (userId: number): PaymentMethod[] => {
  const user = getUserById(userId);
  return user?.paymentMethods || [];
};

export const getOrdersByStatus = (userId: number, status: Order['status']): Order[] => {
  return mockOrders.filter(o => o.userId === userId && o.status === status);
};

