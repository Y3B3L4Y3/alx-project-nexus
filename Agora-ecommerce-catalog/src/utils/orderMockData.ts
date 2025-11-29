// Mock data for orders - frontend only

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  productName: string;
  image: string;
  status: 'Delivered' | 'Shipped' | 'Pending' | 'Cancelled';
  date: string;
  price: number;
  items: OrderItem[];
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
  };
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  trackingNumber?: string;
}

export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    productName: 'Wireless Headphones',
    image: '/vite.svg',
    status: 'Delivered',
    date: '2024-11-25',
    price: 2499,
    items: [
      {
        id: '1',
        productId: 'prod-001',
        productName: 'Wireless Headphones',
        image: '/vite.svg',
        price: 2499,
        quantity: 1,
      },
    ],
    shippingAddress: {
      name: 'John Doe',
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      phone: '+1 234 567 8900',
    },
    paymentMethod: 'Credit Card ending in 4242',
    subtotal: 2499,
    shipping: 0,
    tax: 249.9,
    total: 2748.9,
    trackingNumber: 'TRK123456789',
  },
  {
    id: 'ORD-002',
    productName: 'Smart Watch Series 7',
    image: '/vite.svg',
    status: 'Shipped',
    date: '2024-11-29',
    price: 3299,
    items: [
      {
        id: '2',
        productId: 'prod-002',
        productName: 'Smart Watch Series 7',
        image: '/vite.svg',
        price: 3299,
        quantity: 1,
      },
    ],
    shippingAddress: {
      name: 'John Doe',
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      phone: '+1 234 567 8900',
    },
    paymentMethod: 'Credit Card ending in 4242',
    subtotal: 3299,
    shipping: 0,
    tax: 329.9,
    total: 3628.9,
    trackingNumber: 'TRK987654321',
  },
  {
    id: 'ORD-003',
    productName: 'Running Shoes',
    image: '/vite.svg',
    status: 'Pending',
    date: '2024-12-02',
    price: 1999,
    items: [
      {
        id: '3',
        productId: 'prod-003',
        productName: 'Running Shoes',
        image: '/vite.svg',
        price: 1999,
        quantity: 1,
      },
    ],
    shippingAddress: {
      name: 'John Doe',
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      phone: '+1 234 567 8900',
    },
    paymentMethod: 'Credit Card ending in 4242',
    subtotal: 1999,
    shipping: 0,
    tax: 199.9,
    total: 2198.9,
  },
  {
    id: 'ORD-004',
    productName: 'Gaming Keyboard RGB',
    image: '/vite.svg',
    status: 'Delivered',
    date: '2024-11-20',
    price: 1299,
    items: [
      {
        id: '4',
        productId: 'prod-004',
        productName: 'Gaming Keyboard RGB',
        image: '/vite.svg',
        price: 1299,
        quantity: 1,
      },
    ],
    shippingAddress: {
      name: 'John Doe',
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      phone: '+1 234 567 8900',
    },
    paymentMethod: 'PayPal',
    subtotal: 1299,
    shipping: 0,
    tax: 129.9,
    total: 1428.9,
    trackingNumber: 'TRK555444333',
  },
  {
    id: 'ORD-005',
    productName: 'USB-C Hub Adapter',
    image: '/vite.svg',
    status: 'Cancelled',
    date: '2024-11-18',
    price: 499,
    items: [
      {
        id: '5',
        productId: 'prod-005',
        productName: 'USB-C Hub Adapter',
        image: '/vite.svg',
        price: 499,
        quantity: 1,
      },
    ],
    shippingAddress: {
      name: 'John Doe',
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      phone: '+1 234 567 8900',
    },
    paymentMethod: 'Credit Card ending in 4242',
    subtotal: 499,
    shipping: 0,
    tax: 49.9,
    total: 548.9,
  },
];

export const getOrderById = (id: string): Order | undefined => {
  return mockOrders.find((order) => order.id === id);
};

export const getStatusColor = (status: Order['status']) => {
  switch (status) {
    case 'Delivered':
      return 'bg-green-100 text-green-800';
    case 'Shipped':
      return 'bg-blue-100 text-blue-800';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'Cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

