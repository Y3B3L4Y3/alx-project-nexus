import type { Product, Category, ProductReview } from '../types';

// ============================================
// MOCK PRODUCTS DATA
// ============================================

export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'HAVIT HV-G92 Gamepad',
    slug: 'havit-hv-g92-gamepad',
    description: 'High-quality wireless gamepad with ergonomic design, dual vibration motors, and 12-hour battery life. Compatible with PC, PS4, and Android devices. Features anti-slip grip and responsive buttons for the ultimate gaming experience.',
    price: 120,
    originalPrice: 160,
    discount: 25,
    images: [
      'https://images.unsplash.com/photo-1606318801954-d46d46d3360a?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=600&h=600&fit=crop',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1606318801954-d46d46d3360a?w=300&h=300&fit=crop',
    rating: 5,
    reviewCount: 88,
    stock: 45,
    category: 'Gaming',
    categorySlug: 'gaming',
    brand: 'HAVIT',
    tags: ['gamepad', 'wireless', 'gaming', 'controller'],
    colors: ['#000000', '#FFFFFF', '#DB4444'],
    isNew: false,
    isFeatured: true,
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 2,
    name: 'AK-900 Wired Keyboard',
    slug: 'ak-900-wired-keyboard',
    description: 'Professional RGB mechanical gaming keyboard with Cherry MX switches, customizable backlighting, and N-key rollover. Durable aluminum frame with detachable wrist rest included.',
    price: 960,
    originalPrice: 1160,
    discount: 17,
    images: [
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=600&fit=crop',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=300&h=300&fit=crop',
    rating: 4,
    reviewCount: 75,
    stock: 30,
    category: 'Gaming',
    categorySlug: 'gaming',
    brand: 'AK',
    tags: ['keyboard', 'mechanical', 'rgb', 'gaming'],
    colors: ['#000000', '#FFFFFF'],
    isNew: false,
    isFeatured: true,
    createdAt: '2024-01-10T10:00:00Z',
  },
  {
    id: 3,
    name: 'IPS LCD Gaming Monitor',
    slug: 'ips-lcd-gaming-monitor',
    description: '27-inch IPS LCD gaming monitor with 165Hz refresh rate, 1ms response time, and 4K resolution. Features HDR10 support, adjustable stand, and multiple connectivity options including HDMI 2.1 and DisplayPort.',
    price: 370,
    originalPrice: 400,
    discount: 8,
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=600&h=600&fit=crop',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&h=300&fit=crop',
    rating: 5,
    reviewCount: 99,
    stock: 20,
    category: 'Electronics',
    categorySlug: 'electronics',
    brand: 'Samsung',
    tags: ['monitor', 'gaming', '4k', 'ips'],
    sizes: ['24"', '27"', '32"'],
    isNew: true,
    isFeatured: true,
    createdAt: '2024-02-01T10:00:00Z',
  },
  {
    id: 4,
    name: 'S-Series Comfort Chair',
    slug: 's-series-comfort-chair',
    description: 'Ergonomic office chair with lumbar support, adjustable armrests, and breathable mesh back. Features 360° swivel, height adjustment, and recline function for all-day comfort.',
    price: 375,
    originalPrice: 400,
    discount: 6,
    images: [
      'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=600&h=600&fit=crop',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=300&h=300&fit=crop',
    rating: 4,
    reviewCount: 99,
    stock: 15,
    category: 'Furniture',
    categorySlug: 'furniture',
    brand: 'Comfort Plus',
    tags: ['chair', 'ergonomic', 'office', 'furniture'],
    colors: ['#000000', '#808080', '#FFFFFF'],
    isNew: true,
    isFeatured: false,
    createdAt: '2024-02-05T10:00:00Z',
  },
  {
    id: 5,
    name: 'Gucci Duffle Bag',
    slug: 'gucci-duffle-bag',
    description: 'Premium leather duffle bag with signature GG pattern, gold-tone hardware, and spacious interior. Perfect for weekend getaways with multiple pockets and detachable shoulder strap.',
    price: 960,
    originalPrice: 1160,
    discount: 17,
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&h=300&fit=crop',
    rating: 5,
    reviewCount: 65,
    stock: 10,
    category: 'Fashion',
    categorySlug: 'fashion',
    brand: 'Gucci',
    tags: ['bag', 'duffle', 'leather', 'luxury'],
    colors: ['#8B4513', '#000000'],
    isNew: false,
    isFeatured: true,
    createdAt: '2024-01-20T10:00:00Z',
  },
  {
    id: 6,
    name: 'RGB Liquid CPU Cooler',
    slug: 'rgb-liquid-cpu-cooler',
    description: '240mm AIO liquid CPU cooler with addressable RGB lighting, dual PWM fans, and copper base plate. Compatible with Intel and AMD sockets, featuring low-noise operation and easy installation.',
    price: 160,
    originalPrice: 180,
    discount: 11,
    images: [
      'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&h=600&fit=crop',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=300&h=300&fit=crop',
    rating: 4,
    reviewCount: 65,
    stock: 25,
    category: 'Electronics',
    categorySlug: 'electronics',
    brand: 'Cooler Master',
    tags: ['cooler', 'cpu', 'rgb', 'liquid cooling'],
    isNew: false,
    isFeatured: false,
    createdAt: '2024-01-08T10:00:00Z',
  },
  {
    id: 7,
    name: 'Small BookShelf',
    slug: 'small-bookshelf',
    description: 'Modern 3-tier bookshelf made from solid oak wood with minimalist design. Perfect for small spaces, featuring adjustable shelves and anti-tip hardware included.',
    price: 360,
    images: [
      'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=600&h=600&fit=crop',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=300&h=300&fit=crop',
    rating: 5,
    reviewCount: 65,
    stock: 12,
    category: 'Furniture',
    categorySlug: 'furniture',
    brand: 'IKEA',
    tags: ['bookshelf', 'furniture', 'storage', 'wood'],
    colors: ['#8B4513', '#FFFFFF', '#000000'],
    isNew: true,
    isFeatured: false,
    createdAt: '2024-02-10T10:00:00Z',
  },
  {
    id: 8,
    name: 'Breed Dry Dog Food',
    slug: 'breed-dry-dog-food',
    description: 'Premium dry dog food formulated for all breeds with real chicken as the first ingredient. Contains essential vitamins, minerals, and omega fatty acids for healthy skin and coat.',
    price: 100,
    images: [
      'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=600&h=600&fit=crop',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=300&h=300&fit=crop',
    rating: 3,
    reviewCount: 35,
    stock: 100,
    category: 'Groceries',
    categorySlug: 'groceries',
    brand: 'Purina',
    tags: ['pet food', 'dog food', 'dry food'],
    sizes: ['5kg', '10kg', '20kg'],
    isNew: false,
    isFeatured: false,
    createdAt: '2024-01-05T10:00:00Z',
  },
  {
    id: 9,
    name: 'CANON EOS DSLR Camera',
    slug: 'canon-eos-dslr-camera',
    description: 'Professional DSLR camera with 24.1MP APS-C sensor, DIGIC 8 processor, and 4K video recording. Features dual pixel autofocus, vari-angle touchscreen, and built-in Wi-Fi/Bluetooth.',
    price: 360,
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=600&fit=crop',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&h=300&fit=crop',
    rating: 4,
    reviewCount: 95,
    stock: 8,
    category: 'Electronics',
    categorySlug: 'electronics',
    brand: 'Canon',
    tags: ['camera', 'dslr', 'photography', 'canon'],
    isNew: false,
    isFeatured: true,
    createdAt: '2024-01-12T10:00:00Z',
  },
  {
    id: 10,
    name: 'ASUS FHD Gaming Laptop',
    slug: 'asus-fhd-gaming-laptop',
    description: '15.6" FHD 144Hz gaming laptop with Intel Core i7, RTX 3060 GPU, 16GB RAM, and 512GB NVMe SSD. Features RGB keyboard, advanced cooling system, and up to 8 hours battery life.',
    price: 700,
    originalPrice: 800,
    discount: 13,
    images: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&h=600&fit=crop',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=300&h=300&fit=crop',
    rating: 5,
    reviewCount: 325,
    stock: 15,
    category: 'Electronics',
    categorySlug: 'electronics',
    brand: 'ASUS',
    tags: ['laptop', 'gaming', 'asus', 'rtx'],
    colors: ['#000000', '#808080'],
    isNew: false,
    isFeatured: true,
    createdAt: '2024-01-18T10:00:00Z',
  },
  {
    id: 11,
    name: 'Curology Product Set',
    slug: 'curology-product-set',
    description: 'Complete skincare set including cleanser, moisturizer, and treatment cream. Formulated with dermatologist-approved ingredients for all skin types.',
    price: 500,
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop',
    rating: 4,
    reviewCount: 145,
    stock: 50,
    category: 'Health & Beauty',
    categorySlug: 'health-beauty',
    brand: 'Curology',
    tags: ['skincare', 'beauty', 'set'],
    isNew: true,
    isFeatured: false,
    createdAt: '2024-02-08T10:00:00Z',
  },
  {
    id: 12,
    name: 'Kids Electric Car',
    slug: 'kids-electric-car',
    description: 'Battery-powered ride-on car for kids aged 3-8 with remote control for parents. Features working headlights, horn, MP3 player, and realistic engine sounds.',
    price: 960,
    images: [
      'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=600&h=600&fit=crop',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=300&h=300&fit=crop',
    rating: 5,
    reviewCount: 65,
    stock: 5,
    category: 'Baby & Toys',
    categorySlug: 'baby-toys',
    brand: 'PowerWheels',
    tags: ['toys', 'kids', 'electric car', 'ride-on'],
    colors: ['#FF0000', '#0000FF', '#FFFFFF'],
    isNew: false,
    isFeatured: false,
    createdAt: '2024-01-25T10:00:00Z',
  },
  {
    id: 13,
    name: 'Jr. Zoom Soccer Cleats',
    slug: 'jr-zoom-soccer-cleats',
    description: 'Lightweight soccer cleats for junior players with textured upper for ball control. Features responsive cushioning, firm ground studs, and breathable design.',
    price: 1160,
    originalPrice: 1300,
    discount: 11,
    images: [
      'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=600&h=600&fit=crop',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=300&h=300&fit=crop',
    rating: 5,
    reviewCount: 35,
    stock: 40,
    category: 'Sports',
    categorySlug: 'sports',
    brand: 'Nike',
    tags: ['soccer', 'cleats', 'sports', 'shoes'],
    sizes: ['US 3', 'US 4', 'US 5', 'US 6', 'US 7'],
    colors: ['#FFD700', '#000000', '#FFFFFF'],
    isNew: false,
    isFeatured: false,
    createdAt: '2024-01-22T10:00:00Z',
  },
  {
    id: 14,
    name: 'GP11 Shooter USB Gamepad',
    slug: 'gp11-shooter-usb-gamepad',
    description: 'USB gamepad optimized for shooter games with programmable buttons, adjustable sensitivity, and turbo function. Compatible with PC and supports vibration feedback.',
    price: 660,
    images: [
      'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=600&h=600&fit=crop',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=300&h=300&fit=crop',
    rating: 4,
    reviewCount: 55,
    stock: 35,
    category: 'Gaming',
    categorySlug: 'gaming',
    brand: 'Logitech',
    tags: ['gamepad', 'usb', 'gaming', 'shooter'],
    colors: ['#000000', '#FFFFFF'],
    isNew: false,
    isFeatured: false,
    createdAt: '2024-01-14T10:00:00Z',
  },
  {
    id: 15,
    name: 'Quilted Satin Jacket',
    slug: 'quilted-satin-jacket',
    description: 'Elegant quilted satin jacket with ribbed cuffs and hem. Features front zip closure, side pockets, and lightweight insulation perfect for transitional weather.',
    price: 660,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop',
    rating: 4,
    reviewCount: 55,
    stock: 20,
    category: 'Fashion',
    categorySlug: 'fashion',
    brand: 'Zara',
    tags: ['jacket', 'fashion', 'satin', 'quilted'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['#000000', '#800020', '#000080'],
    isNew: false,
    isFeatured: false,
    createdAt: '2024-01-16T10:00:00Z',
  },
  {
    id: 16,
    name: 'JBL Boombox 3 Speaker',
    slug: 'jbl-boombox-3-speaker',
    description: 'Powerful portable Bluetooth speaker with 24 hours playtime, IP67 waterproof rating, and PartyBoost feature. Delivers deep bass and clear highs with JBL Original Pro Sound.',
    price: 350,
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop',
    rating: 5,
    reviewCount: 220,
    stock: 18,
    category: 'Electronics',
    categorySlug: 'electronics',
    brand: 'JBL',
    tags: ['speaker', 'bluetooth', 'portable', 'jbl'],
    colors: ['#000000', '#808080', '#FF0000'],
    isNew: true,
    isFeatured: true,
    createdAt: '2024-02-12T10:00:00Z',
  },
];

// ============================================
// MOCK CATEGORIES DATA
// ============================================

export const mockCategories: Category[] = [
  { id: 1, name: "Woman's Fashion", slug: 'womens-fashion', productCount: 245 },
  { id: 2, name: "Men's Fashion", slug: 'mens-fashion', productCount: 312 },
  { id: 3, name: 'Electronics', slug: 'electronics', productCount: 456 },
  { id: 4, name: 'Home & Lifestyle', slug: 'home-lifestyle', productCount: 189 },
  { id: 5, name: 'Medicine', slug: 'medicine', productCount: 78 },
  { id: 6, name: 'Sports & Outdoor', slug: 'sports-outdoor', productCount: 234 },
  { id: 7, name: "Baby's & Toys", slug: 'baby-toys', productCount: 156 },
  { id: 8, name: 'Groceries & Pets', slug: 'groceries-pets', productCount: 289 },
  { id: 9, name: 'Health & Beauty', slug: 'health-beauty', productCount: 167 },
  { id: 10, name: 'Gaming', slug: 'gaming', productCount: 198 },
  { id: 11, name: 'Furniture', slug: 'furniture', productCount: 134 },
  { id: 12, name: 'Fashion', slug: 'fashion', productCount: 445 },
];

// ============================================
// MOCK REVIEWS DATA
// ============================================

export const mockReviews: ProductReview[] = [
  {
    id: 1,
    productId: 1,
    userId: 101,
    userName: 'John Smith',
    userAvatar: 'https://i.pravatar.cc/150?u=john',
    rating: 5,
    title: 'Best gamepad I ever owned!',
    comment: 'The build quality is amazing and the wireless connection is super stable. Battery life is exactly as advertised. Highly recommend!',
    createdAt: '2024-02-10T14:30:00Z',
    helpful: 24,
  },
  {
    id: 2,
    productId: 1,
    userId: 102,
    userName: 'Sarah Johnson',
    userAvatar: 'https://i.pravatar.cc/150?u=sarah',
    rating: 5,
    title: 'Great for PC gaming',
    comment: 'Works perfectly with all my games. The ergonomic design is comfortable for long gaming sessions.',
    createdAt: '2024-02-08T09:15:00Z',
    helpful: 18,
  },
  {
    id: 3,
    productId: 1,
    userId: 103,
    userName: 'Mike Chen',
    userAvatar: 'https://i.pravatar.cc/150?u=mike',
    rating: 4,
    title: 'Good value for money',
    comment: 'Solid controller at this price point. Only minor complaint is the D-pad could be more responsive.',
    createdAt: '2024-02-05T16:45:00Z',
    helpful: 12,
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export const getProductById = (id: number): Product | undefined => {
  return mockProducts.find(p => p.id === id);
};

export const getProductsByCategory = (categorySlug: string): Product[] => {
  return mockProducts.filter(p => p.categorySlug === categorySlug);
};

export const getFeaturedProducts = (): Product[] => {
  return mockProducts.filter(p => p.isFeatured);
};

export const getNewProducts = (): Product[] => {
  return mockProducts.filter(p => p.isNew);
};

export const getRelatedProducts = (productId: number, limit: number = 4): Product[] => {
  const product = getProductById(productId);
  if (!product) return [];
  
  return mockProducts
    .filter(p => p.id !== productId && p.categorySlug === product.categorySlug)
    .slice(0, limit);
};

export const searchProducts = (query: string): Product[] => {
  const lowerQuery = query.toLowerCase();
  return mockProducts.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery) ||
    p.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

export const getProductReviews = (productId: number): ProductReview[] => {
  return mockReviews.filter(r => r.productId === productId);
};

