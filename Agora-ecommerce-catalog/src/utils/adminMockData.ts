// Admin Mock Data - Realistic data for all admin pages

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  category: string;
  status: 'Active' | 'Draft' | 'Out of Stock';
  image: string;
  sku: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  customer: string;
  email: string;
  phone: string;
  product: string;
  items: number;
  amount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentMethod: string;
  shippingAddress: string;
  date: string;
  trackingNumber?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Customer' | 'Admin' | 'Moderator';
  status: 'Active' | 'Suspended';
  joinDate: string;
  lastLogin: string;
  orders: number;
  totalSpent: number;
  avatar?: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'Unread' | 'Read' | 'Replied';
  date: string;
  priority: 'Low' | 'Medium' | 'High';
}

export interface StoreSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  currency: string;
  taxRate: string;
  shippingFee: string;
  freeShippingThreshold: string;
}

export interface SocialLinks {
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  youtube: string;
}

// Mock Products Data
export const mockProducts: Product[] = [
  {
    id: '1',
    title: 'ASUS ROG Gaming Laptop',
    description: 'High-performance gaming laptop with RTX 4070',
    price: 1499,
    originalPrice: 1799,
    stock: 45,
    category: 'Electronics',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=100',
    sku: 'ASUS-ROG-001',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Logitech MX Master 3S',
    description: 'Premium wireless mouse for productivity',
    price: 99,
    originalPrice: 129,
    stock: 120,
    category: 'Accessories',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100',
    sku: 'LOG-MX3S-002',
    createdAt: '2024-01-02',
    updatedAt: '2024-01-14',
  },
  {
    id: '3',
    title: 'Keychron K8 Pro Keyboard',
    description: 'Wireless mechanical keyboard with RGB',
    price: 159,
    stock: 0,
    category: 'Accessories',
    status: 'Out of Stock',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=100',
    sku: 'KEY-K8P-003',
    createdAt: '2024-01-03',
    updatedAt: '2024-01-13',
  },
  {
    id: '4',
    title: 'LG UltraGear 27" Monitor',
    description: '4K 144Hz gaming monitor with HDR',
    price: 449,
    originalPrice: 549,
    stock: 30,
    category: 'Electronics',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=100',
    sku: 'LG-UG27-004',
    createdAt: '2024-01-04',
    updatedAt: '2024-01-12',
  },
  {
    id: '5',
    title: 'Anker USB-C Hub 10-in-1',
    description: 'Multi-port adapter with 4K HDMI',
    price: 69,
    stock: 85,
    category: 'Accessories',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=100',
    sku: 'ANK-HUB-005',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-11',
  },
  {
    id: '6',
    title: 'Sony WH-1000XM5',
    description: 'Premium noise-cancelling headphones',
    price: 349,
    originalPrice: 399,
    stock: 55,
    category: 'Audio',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100',
    sku: 'SONY-XM5-006',
    createdAt: '2024-01-06',
    updatedAt: '2024-01-10',
  },
  {
    id: '7',
    title: 'Samsung T7 SSD 1TB',
    description: 'Portable SSD with USB 3.2',
    price: 109,
    stock: 200,
    category: 'Storage',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=100',
    sku: 'SAM-T7-007',
    createdAt: '2024-01-07',
    updatedAt: '2024-01-09',
  },
  {
    id: '8',
    title: 'Apple AirPods Pro 2',
    description: 'Wireless earbuds with ANC',
    price: 249,
    stock: 75,
    category: 'Audio',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=100',
    sku: 'APL-APP2-008',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-08',
  },
  {
    id: '9',
    title: 'Razer DeathAdder V3',
    description: 'Ergonomic gaming mouse',
    price: 89,
    stock: 15,
    category: 'Gaming',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100',
    sku: 'RAZ-DAV3-009',
    createdAt: '2024-01-09',
    updatedAt: '2024-01-15',
  },
  {
    id: '10',
    title: 'Dell XPS 15 Laptop',
    description: 'Premium ultrabook with OLED display',
    price: 1899,
    originalPrice: 2199,
    stock: 8,
    category: 'Electronics',
    status: 'Draft',
    image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=100',
    sku: 'DELL-XPS15-010',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-15',
  },
];

// Mock Orders Data
export const mockOrders: Order[] = [
  {
    id: '#ORD-2024-1001',
    customer: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 234 567 8901',
    product: 'ASUS ROG Gaming Laptop',
    items: 1,
    amount: 1499,
    status: 'Delivered',
    paymentMethod: 'Credit Card',
    shippingAddress: '123 Main St, New York, NY 10001',
    date: '2024-01-15',
    trackingNumber: 'TRK123456789',
  },
  {
    id: '#ORD-2024-1002',
    customer: 'Jane Smith',
    email: 'jane.smith@email.com',
    phone: '+1 234 567 8902',
    product: 'Logitech MX Master 3S',
    items: 2,
    amount: 198,
    status: 'Processing',
    paymentMethod: 'PayPal',
    shippingAddress: '456 Oak Ave, Los Angeles, CA 90001',
    date: '2024-01-15',
  },
  {
    id: '#ORD-2024-1003',
    customer: 'Bob Johnson',
    email: 'bob.johnson@email.com',
    phone: '+1 234 567 8903',
    product: 'Sony WH-1000XM5',
    items: 1,
    amount: 349,
    status: 'Shipped',
    paymentMethod: 'Credit Card',
    shippingAddress: '789 Pine Rd, Chicago, IL 60601',
    date: '2024-01-14',
    trackingNumber: 'TRK987654321',
  },
  {
    id: '#ORD-2024-1004',
    customer: 'Alice Brown',
    email: 'alice.brown@email.com',
    phone: '+1 234 567 8904',
    product: 'LG UltraGear 27" Monitor',
    items: 1,
    amount: 449,
    status: 'Delivered',
    paymentMethod: 'Debit Card',
    shippingAddress: '321 Elm St, Houston, TX 77001',
    date: '2024-01-14',
    trackingNumber: 'TRK456789123',
  },
  {
    id: '#ORD-2024-1005',
    customer: 'Charlie Wilson',
    email: 'charlie.wilson@email.com',
    phone: '+1 234 567 8905',
    product: 'Anker USB-C Hub',
    items: 3,
    amount: 207,
    status: 'Pending',
    paymentMethod: 'Credit Card',
    shippingAddress: '654 Maple Dr, Phoenix, AZ 85001',
    date: '2024-01-13',
  },
  {
    id: '#ORD-2024-1006',
    customer: 'Diana Prince',
    email: 'diana.prince@email.com',
    phone: '+1 234 567 8906',
    product: 'Apple AirPods Pro 2',
    items: 1,
    amount: 249,
    status: 'Processing',
    paymentMethod: 'Apple Pay',
    shippingAddress: '987 Cedar Ln, Philadelphia, PA 19101',
    date: '2024-01-13',
  },
  {
    id: '#ORD-2024-1007',
    customer: 'Edward Norton',
    email: 'edward.norton@email.com',
    phone: '+1 234 567 8907',
    product: 'Samsung T7 SSD 1TB',
    items: 2,
    amount: 218,
    status: 'Shipped',
    paymentMethod: 'Credit Card',
    shippingAddress: '147 Birch Ave, San Antonio, TX 78201',
    date: '2024-01-12',
    trackingNumber: 'TRK789123456',
  },
  {
    id: '#ORD-2024-1008',
    customer: 'Fiona Green',
    email: 'fiona.green@email.com',
    phone: '+1 234 567 8908',
    product: 'Razer DeathAdder V3',
    items: 1,
    amount: 89,
    status: 'Cancelled',
    paymentMethod: 'PayPal',
    shippingAddress: '258 Spruce St, San Diego, CA 92101',
    date: '2024-01-12',
  },
  {
    id: '#ORD-2024-1009',
    customer: 'George Harris',
    email: 'george.harris@email.com',
    phone: '+1 234 567 8909',
    product: 'Dell XPS 15 Laptop',
    items: 1,
    amount: 1899,
    status: 'Pending',
    paymentMethod: 'Credit Card',
    shippingAddress: '369 Willow Way, Dallas, TX 75201',
    date: '2024-01-11',
  },
  {
    id: '#ORD-2024-1010',
    customer: 'Hannah White',
    email: 'hannah.white@email.com',
    phone: '+1 234 567 8910',
    product: 'Keychron K8 Pro Keyboard',
    items: 1,
    amount: 159,
    status: 'Delivered',
    paymentMethod: 'Debit Card',
    shippingAddress: '741 Oak Blvd, San Jose, CA 95101',
    date: '2024-01-10',
    trackingNumber: 'TRK321654987',
  },
];

// Mock Users Data
export const mockUsers: User[] = [
  {
    id: 'USR-001',
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 234 567 8901',
    role: 'Customer',
    status: 'Active',
    joinDate: '2023-06-15',
    lastLogin: '2024-01-15 10:30',
    orders: 12,
    totalSpent: 3245,
  },
  {
    id: 'USR-002',
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    phone: '+1 234 567 8902',
    role: 'Customer',
    status: 'Active',
    joinDate: '2023-08-20',
    lastLogin: '2024-01-14 15:45',
    orders: 8,
    totalSpent: 1890,
  },
  {
    id: 'USR-003',
    name: 'Bob Johnson',
    email: 'bob.johnson@email.com',
    phone: '+1 234 567 8903',
    role: 'Moderator',
    status: 'Active',
    joinDate: '2023-03-10',
    lastLogin: '2024-01-15 09:00',
    orders: 25,
    totalSpent: 5670,
  },
  {
    id: 'USR-004',
    name: 'Alice Brown',
    email: 'alice.brown@email.com',
    phone: '+1 234 567 8904',
    role: 'Customer',
    status: 'Active',
    joinDate: '2023-11-05',
    lastLogin: '2024-01-13 18:20',
    orders: 5,
    totalSpent: 789,
  },
  {
    id: 'USR-005',
    name: 'Charlie Wilson',
    email: 'charlie.wilson@email.com',
    phone: '+1 234 567 8905',
    role: 'Customer',
    status: 'Suspended',
    joinDate: '2023-09-12',
    lastLogin: '2024-01-10 12:00',
    orders: 2,
    totalSpent: 150,
  },
  {
    id: 'USR-006',
    name: 'Diana Prince',
    email: 'diana.prince@email.com',
    phone: '+1 234 567 8906',
    role: 'Admin',
    status: 'Active',
    joinDate: '2023-01-01',
    lastLogin: '2024-01-15 08:00',
    orders: 0,
    totalSpent: 0,
  },
  {
    id: 'USR-007',
    name: 'Edward Norton',
    email: 'edward.norton@email.com',
    phone: '+1 234 567 8907',
    role: 'Customer',
    status: 'Active',
    joinDate: '2023-07-22',
    lastLogin: '2024-01-12 14:30',
    orders: 15,
    totalSpent: 2340,
  },
  {
    id: 'USR-008',
    name: 'Fiona Green',
    email: 'fiona.green@email.com',
    phone: '+1 234 567 8908',
    role: 'Customer',
    status: 'Active',
    joinDate: '2023-10-18',
    lastLogin: '2024-01-11 11:15',
    orders: 7,
    totalSpent: 1120,
  },
];

// Mock Messages Data
export const mockMessages: Message[] = [
  {
    id: 'MSG-001',
    name: 'Michael Scott',
    email: 'michael.scott@dundermifflin.com',
    phone: '+1 570 555 0101',
    subject: 'Product Inquiry - Gaming Laptop',
    message: 'Hi, I would like to know more about the ASUS ROG Gaming Laptop specifications. Does it come with a warranty? What are the return policies?',
    status: 'Unread',
    date: '2024-01-15 10:30',
    priority: 'High',
  },
  {
    id: 'MSG-002',
    name: 'Pam Beesly',
    email: 'pam.beesly@dundermifflin.com',
    phone: '+1 570 555 0102',
    subject: 'Shipping Delay - Order #ORD-2024-1002',
    message: 'My order has been in processing status for 3 days now. Can you please check the status and provide an estimated delivery date?',
    status: 'Read',
    date: '2024-01-14 14:20',
    priority: 'Medium',
  },
  {
    id: 'MSG-003',
    name: 'Jim Halpert',
    email: 'jim.halpert@dundermifflin.com',
    phone: '+1 570 555 0103',
    subject: 'Return Request - Defective Keyboard',
    message: 'I received my Keychron K8 Pro keyboard yesterday but some keys are not working properly. I would like to initiate a return and get a replacement.',
    status: 'Replied',
    date: '2024-01-13 09:15',
    priority: 'High',
  },
  {
    id: 'MSG-004',
    name: 'Dwight Schrute',
    email: 'dwight.schrute@dundermifflin.com',
    phone: '+1 570 555 0104',
    subject: 'Bulk Order Inquiry',
    message: 'I am interested in placing a bulk order for 50 units of the Anker USB-C Hub for our office. Do you offer any corporate discounts?',
    status: 'Unread',
    date: '2024-01-12 16:45',
    priority: 'High',
  },
  {
    id: 'MSG-005',
    name: 'Angela Martin',
    email: 'angela.martin@dundermifflin.com',
    phone: '+1 570 555 0105',
    subject: 'Payment Issue',
    message: 'I was charged twice for my recent order. Please look into this and process a refund for the duplicate charge.',
    status: 'Read',
    date: '2024-01-11 11:30',
    priority: 'High',
  },
  {
    id: 'MSG-006',
    name: 'Kevin Malone',
    email: 'kevin.malone@dundermifflin.com',
    phone: '+1 570 555 0106',
    subject: 'Product Recommendation',
    message: 'I am looking for a good gaming headset under $200. Can you recommend something from your store?',
    status: 'Replied',
    date: '2024-01-10 15:00',
    priority: 'Low',
  },
];

// Default Store Settings
export const defaultStoreSettings: StoreSettings = {
  storeName: 'Agora E-Commerce',
  storeEmail: 'contact@agora.com',
  storePhone: '+1 234 567 8900',
  storeAddress: '123 Commerce Street, Tech City, TC 12345',
  currency: 'USD',
  taxRate: '10',
  shippingFee: '9.99',
  freeShippingThreshold: '100',
};

// Default Social Links
export const defaultSocialLinks: SocialLinks = {
  facebook: 'https://facebook.com/agorastore',
  twitter: 'https://twitter.com/agorastore',
  instagram: 'https://instagram.com/agorastore',
  linkedin: 'https://linkedin.com/company/agorastore',
  youtube: 'https://youtube.com/@agorastore',
};

// Dashboard Statistics
export const dashboardStats = {
  totalSales: 45231,
  totalOrders: 1234,
  totalUsers: 8549,
  totalRevenue: 28450,
  newOrdersToday: 24,
  pendingOrders: 8,
  newMessagesToday: 5,
  newUsersToday: 12,
};

// Categories
export const categories = [
  'Electronics',
  'Accessories',
  'Audio',
  'Gaming',
  'Storage',
  'Computers',
  'Phones',
  'Tablets',
  'Wearables',
  'Home & Office',
];

