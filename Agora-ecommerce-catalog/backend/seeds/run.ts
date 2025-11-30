import { pool } from '../src/config/database';
import { hashPassword } from '../src/utils/password';

const seedDatabase = async () => {
  console.log('Seeding database...\n');

  try {
    // Create super admin user
    const superAdminPassword = await hashPassword('SuperAdmin@123');
    await pool.execute(
      `INSERT INTO users (email, password_hash, first_name, last_name, role, email_verified)
       VALUES (?, ?, ?, ?, 'super_admin', TRUE)
       ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
      ['superadmin@agora.com', superAdminPassword, 'Super', 'Admin']
    );
    console.log('✅ Super Admin created (superadmin@agora.com / SuperAdmin@123)');

    // Create admin user
    const adminPassword = await hashPassword('Admin@123');
    await pool.execute(
      `INSERT INTO users (email, password_hash, first_name, last_name, role, email_verified)
       VALUES (?, ?, ?, ?, 'admin', TRUE)
       ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
      ['admin@agora.com', adminPassword, 'Admin', 'User']
    );
    console.log('✅ Admin user created (admin@agora.com / Admin@123)');

    // Create moderator user
    const moderatorPassword = await hashPassword('Moderator@123');
    await pool.execute(
      `INSERT INTO users (email, password_hash, first_name, last_name, role, email_verified)
       VALUES (?, ?, ?, ?, 'moderator', TRUE)
       ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
      ['moderator@agora.com', moderatorPassword, 'Mod', 'User']
    );
    console.log('✅ Moderator user created (moderator@agora.com / Moderator@123)');

    // Create editor user
    const editorPassword = await hashPassword('Editor@123');
    await pool.execute(
      `INSERT INTO users (email, password_hash, first_name, last_name, role, email_verified)
       VALUES (?, ?, ?, ?, 'editor', TRUE)
       ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
      ['editor@agora.com', editorPassword, 'Editor', 'User']
    );
    console.log('✅ Editor user created (editor@agora.com / Editor@123)');

    // Create viewer user
    const viewerPassword = await hashPassword('Viewer@123');
    await pool.execute(
      `INSERT INTO users (email, password_hash, first_name, last_name, role, email_verified)
       VALUES (?, ?, ?, ?, 'viewer', TRUE)
       ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
      ['viewer@agora.com', viewerPassword, 'Viewer', 'User']
    );
    console.log('✅ Viewer user created (viewer@agora.com / Viewer@123)');

    // Create sample customer
    const customerPassword = await hashPassword('Customer@123');
    await pool.execute(
      `INSERT INTO users (email, password_hash, first_name, last_name, role, email_verified)
       VALUES (?, ?, ?, ?, 'customer', TRUE)
       ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
      ['customer@example.com', customerPassword, 'John', 'Doe']
    );
    console.log('✅ Sample customer created (customer@example.com / Customer@123)');

    // Create categories
    const categories = [
      { name: 'Electronics', slug: 'electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400' },
      { name: 'Fashion', slug: 'fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400' },
      { name: 'Gaming', slug: 'gaming', image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400' },
      { name: 'Furniture', slug: 'furniture', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400' },
      { name: 'Sports', slug: 'sports', image: 'https://images.unsplash.com/photo-1461896836934- voices-in-the-park?w=400' },
      { name: 'Health & Beauty', slug: 'health-beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400' },
      { name: 'Groceries', slug: 'groceries', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400' },
      { name: "Baby & Toys", slug: 'baby-toys', image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400' },
    ];

    for (const cat of categories) {
      await pool.execute(
        `INSERT INTO categories (name, slug, image) VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE name = VALUES(name), image = VALUES(image)`,
        [cat.name, cat.slug, cat.image]
      );
    }
    console.log(`✅ ${categories.length} categories created`);

    // Create sample products - 35 diverse products
    const products = [
      // ==================== ELECTRONICS (8 products) ====================
      {
        name: 'iPhone 15 Pro Max',
        slug: 'iphone-15-pro-max',
        description: 'The most powerful iPhone ever with A17 Pro chip, titanium design, and 48MP camera system. Features USB-C, Action button, and all-day battery life.',
        price: 1199.00,
        original_price: 1299.00,
        discount: 8,
        thumbnail: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400',
        stock: 25,
        category: 'electronics',
        brand: 'Apple',
        is_new: true,
        is_featured: true,
        colors: JSON.stringify(['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium']),
        sizes: JSON.stringify(['128GB', '256GB', '512GB', '1TB']),
        tags: JSON.stringify(['smartphone', 'apple', 'premium', '5g']),
      },
      {
        name: 'Samsung Galaxy S24 Ultra',
        slug: 'samsung-galaxy-s24-ultra',
        description: 'Galaxy AI is here. The ultimate smartphone with built-in S Pen, 200MP camera, and titanium frame. Powered by Snapdragon 8 Gen 3.',
        price: 1099.00,
        original_price: 1299.00,
        discount: 15,
        thumbnail: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400',
        stock: 30,
        category: 'electronics',
        brand: 'Samsung',
        is_new: true,
        is_featured: true,
        colors: JSON.stringify(['Titanium Gray', 'Titanium Black', 'Titanium Violet', 'Titanium Yellow']),
        sizes: JSON.stringify(['256GB', '512GB', '1TB']),
        tags: JSON.stringify(['smartphone', 'samsung', 'android', 'ai']),
      },
      {
        name: 'Sony WH-1000XM5 Headphones',
        slug: 'sony-wh-1000xm5-headphones',
        description: 'Industry-leading noise cancellation with Auto NC Optimizer. 30-hour battery life, crystal clear hands-free calling, and multipoint connection.',
        price: 348.00,
        original_price: 399.00,
        discount: 13,
        thumbnail: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400',
        stock: 50,
        category: 'electronics',
        brand: 'Sony',
        is_featured: true,
        colors: JSON.stringify(['Black', 'Silver', 'Midnight Blue']),
        tags: JSON.stringify(['headphones', 'wireless', 'noise-cancelling', 'premium']),
      },
      {
        name: 'MacBook Pro 14" M3 Pro',
        slug: 'macbook-pro-14-m3-pro',
        description: 'Supercharged by M3 Pro chip with 18-core GPU. Stunning Liquid Retina XDR display, up to 17 hours battery life, and MagSafe charging.',
        price: 1999.00,
        original_price: 2199.00,
        discount: 9,
        thumbnail: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
        stock: 15,
        category: 'electronics',
        brand: 'Apple',
        is_new: true,
        is_featured: true,
        colors: JSON.stringify(['Space Black', 'Silver']),
        sizes: JSON.stringify(['512GB', '1TB', '2TB']),
        tags: JSON.stringify(['laptop', 'apple', 'professional', 'm3']),
      },
      {
        name: 'Samsung 65" QLED 4K Smart TV',
        slug: 'samsung-65-qled-4k-tv',
        description: 'Quantum HDR+ with 100% Color Volume. Neural Quantum Processor 4K, Object Tracking Sound, and Gaming Hub built-in.',
        price: 1297.00,
        original_price: 1599.00,
        discount: 19,
        thumbnail: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400',
        stock: 12,
        category: 'electronics',
        brand: 'Samsung',
        is_featured: true,
        sizes: JSON.stringify(['55"', '65"', '75"', '85"']),
        tags: JSON.stringify(['tv', 'smart-tv', '4k', 'qled']),
      },
      {
        name: 'Apple AirPods Pro 2nd Gen',
        slug: 'apple-airpods-pro-2',
        description: 'Rebuilt from the sound up with H2 chip. 2x Active Noise Cancellation, Adaptive Transparency, and Personalized Spatial Audio.',
        price: 229.00,
        original_price: 249.00,
        discount: 8,
        thumbnail: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400',
        stock: 80,
        category: 'electronics',
        brand: 'Apple',
        is_new: true,
        colors: JSON.stringify(['White']),
        tags: JSON.stringify(['earbuds', 'wireless', 'apple', 'noise-cancelling']),
      },
      {
        name: 'iPad Pro 12.9" M2',
        slug: 'ipad-pro-12-9-m2',
        description: 'The ultimate iPad experience with M2 chip, Liquid Retina XDR display, and Apple Pencil hover. Pro cameras and LiDAR Scanner.',
        price: 1099.00,
        original_price: 1199.00,
        discount: 8,
        thumbnail: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
        stock: 20,
        category: 'electronics',
        brand: 'Apple',
        is_featured: true,
        colors: JSON.stringify(['Space Gray', 'Silver']),
        sizes: JSON.stringify(['128GB', '256GB', '512GB', '1TB', '2TB']),
        tags: JSON.stringify(['tablet', 'apple', 'professional', 'm2']),
      },
      {
        name: 'Bose QuietComfort Ultra Earbuds',
        slug: 'bose-quietcomfort-ultra-earbuds',
        description: 'World-class noise cancellation with Immersive Audio. CustomTune technology, 6 hours battery, and secure fit.',
        price: 279.00,
        original_price: 299.00,
        discount: 7,
        thumbnail: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
        stock: 45,
        category: 'electronics',
        brand: 'Bose',
        is_new: true,
        colors: JSON.stringify(['Black', 'White Smoke', 'Moonstone Blue']),
        tags: JSON.stringify(['earbuds', 'wireless', 'bose', 'premium']),
      },

      // ==================== FASHION (7 products) ====================
      {
        name: 'Nike Air Max 270',
        slug: 'nike-air-max-270',
        description: 'The first lifestyle Air Max with a large window and heel unit. Breathable mesh upper and foam midsole for all-day comfort.',
        price: 150.00,
        original_price: 170.00,
        discount: 12,
        thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
        stock: 60,
        category: 'fashion',
        brand: 'Nike',
        is_featured: true,
        colors: JSON.stringify(['Black/White', 'White/Red', 'Blue/Navy', 'Triple Black']),
        sizes: JSON.stringify(['US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12']),
        tags: JSON.stringify(['shoes', 'sneakers', 'nike', 'running']),
      },
      {
        name: 'Adidas Ultraboost 23',
        slug: 'adidas-ultraboost-23',
        description: 'Experience incredible energy return with BOOST midsole. Primeknit+ upper adapts to your foot for a supportive fit.',
        price: 180.00,
        original_price: 190.00,
        discount: 5,
        thumbnail: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400',
        stock: 45,
        category: 'fashion',
        brand: 'Adidas',
        is_new: true,
        colors: JSON.stringify(['Core Black', 'Cloud White', 'Grey Six', 'Solar Red']),
        sizes: JSON.stringify(['US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12']),
        tags: JSON.stringify(['shoes', 'sneakers', 'adidas', 'running']),
      },
      {
        name: "Levi's 501 Original Jeans",
        slug: 'levis-501-original-jeans',
        description: 'The original blue jean since 1873. Signature straight leg, button fly, and authentic vintage character.',
        price: 69.50,
        original_price: 89.50,
        discount: 22,
        thumbnail: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
        stock: 100,
        category: 'fashion',
        brand: "Levi's",
        is_featured: true,
        colors: JSON.stringify(['Medium Stonewash', 'Dark Stonewash', 'Black', 'Light Wash']),
        sizes: JSON.stringify(['28', '30', '32', '34', '36', '38']),
        tags: JSON.stringify(['jeans', 'denim', 'levis', 'classic']),
      },
      {
        name: 'The North Face Puffer Jacket',
        slug: 'north-face-puffer-jacket',
        description: '700-fill goose down insulation for lightweight warmth. Water-resistant finish and packable design for easy travel.',
        price: 249.00,
        original_price: 299.00,
        discount: 17,
        thumbnail: 'https://images.unsplash.com/photo-1544923246-77307dd628b5?w=400',
        stock: 35,
        category: 'fashion',
        brand: 'The North Face',
        is_new: true,
        is_featured: true,
        colors: JSON.stringify(['TNF Black', 'Summit Navy', 'New Taupe Green', 'Fiery Red']),
        sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL', 'XXL']),
        tags: JSON.stringify(['jacket', 'winter', 'outdoor', 'puffer']),
      },
      {
        name: 'Ray-Ban Aviator Classic',
        slug: 'ray-ban-aviator-classic',
        description: 'The iconic Ray-Ban Aviator with gold frame and crystal green lenses. 100% UV protection.',
        price: 161.00,
        original_price: 182.00,
        discount: 12,
        thumbnail: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
        stock: 70,
        category: 'fashion',
        brand: 'Ray-Ban',
        colors: JSON.stringify(['Gold/Green', 'Gold/Brown', 'Silver/Blue', 'Black/Grey']),
        tags: JSON.stringify(['sunglasses', 'accessories', 'ray-ban', 'classic']),
      },
      {
        name: 'Fossil Leather Chronograph Watch',
        slug: 'fossil-leather-chronograph-watch',
        description: 'Classic chronograph with genuine leather strap. 44mm stainless steel case, water resistant to 50m.',
        price: 139.00,
        original_price: 175.00,
        discount: 21,
        thumbnail: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400',
        stock: 40,
        category: 'fashion',
        brand: 'Fossil',
        is_featured: true,
        colors: JSON.stringify(['Brown Leather', 'Black Leather', 'Navy Leather']),
        tags: JSON.stringify(['watch', 'accessories', 'fossil', 'leather']),
      },
      {
        name: 'Champion Reverse Weave Hoodie',
        slug: 'champion-reverse-weave-hoodie',
        description: 'The original Reverse Weave construction minimizes shrinkage. Heavyweight fleece for warmth and durability.',
        price: 70.00,
        original_price: 85.00,
        discount: 18,
        thumbnail: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
        stock: 55,
        category: 'fashion',
        brand: 'Champion',
        colors: JSON.stringify(['Oxford Grey', 'Black', 'Navy', 'Scarlet', 'Forest Green']),
        sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
        tags: JSON.stringify(['hoodie', 'streetwear', 'champion', 'casual']),
      },

      // ==================== GAMING (6 products) ====================
      {
        name: 'PlayStation 5 Console',
        slug: 'playstation-5-console',
        description: 'Experience lightning-fast loading, deeper immersion with haptic feedback, adaptive triggers, and 3D Audio. Play thousands of PS5 and PS4 games.',
        price: 499.00,
        original_price: 549.00,
        discount: 9,
        thumbnail: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400',
        stock: 10,
        category: 'gaming',
        brand: 'Sony',
        is_new: true,
        is_featured: true,
        tags: JSON.stringify(['console', 'playstation', 'gaming', 'sony']),
      },
      {
        name: 'Xbox Series X',
        slug: 'xbox-series-x',
        description: 'The fastest, most powerful Xbox ever. 12 teraflops of processing power, true 4K gaming, and Quick Resume.',
        price: 479.00,
        original_price: 499.00,
        discount: 4,
        thumbnail: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400',
        stock: 15,
        category: 'gaming',
        brand: 'Microsoft',
        is_featured: true,
        tags: JSON.stringify(['console', 'xbox', 'gaming', 'microsoft']),
      },
      {
        name: 'Nintendo Switch OLED',
        slug: 'nintendo-switch-oled',
        description: 'Vibrant 7-inch OLED screen, enhanced audio, and a wide adjustable stand. Play at home or on-the-go.',
        price: 349.00,
        original_price: 369.00,
        discount: 5,
        thumbnail: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400',
        stock: 25,
        category: 'gaming',
        brand: 'Nintendo',
        is_new: true,
        colors: JSON.stringify(['White', 'Neon Red/Blue']),
        tags: JSON.stringify(['console', 'nintendo', 'portable', 'gaming']),
      },
      {
        name: 'Razer DeathAdder V3 Pro',
        slug: 'razer-deathadder-v3-pro',
        description: 'Ultra-lightweight ergonomic esports mouse with Focus Pro 30K Optical Sensor. 90-hour battery life.',
        price: 149.00,
        original_price: 169.00,
        discount: 12,
        thumbnail: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400',
        stock: 40,
        category: 'gaming',
        brand: 'Razer',
        is_featured: true,
        colors: JSON.stringify(['Black', 'White']),
        tags: JSON.stringify(['mouse', 'gaming', 'razer', 'wireless']),
      },
      {
        name: 'SteelSeries Arctis Nova Pro',
        slug: 'steelseries-arctis-nova-pro',
        description: 'Premium Hi-Fi gaming headset with Active Noise Cancellation. Infinity battery system and 360° Spatial Audio.',
        price: 349.00,
        original_price: 379.00,
        discount: 8,
        thumbnail: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=400',
        stock: 30,
        category: 'gaming',
        brand: 'SteelSeries',
        is_new: true,
        colors: JSON.stringify(['Black', 'White']),
        tags: JSON.stringify(['headset', 'gaming', 'steelseries', 'wireless']),
      },
      {
        name: 'HAVIT HV-G92 Gamepad',
        slug: 'havit-hv-g92-gamepad',
        description: 'High-quality wireless gamepad with ergonomic design, dual vibration motors, and 12-hour battery life.',
        price: 120.00,
        original_price: 160.00,
        discount: 25,
        thumbnail: 'https://images.unsplash.com/photo-1606318801954-d46d46d3360a?w=400',
        stock: 45,
        category: 'gaming',
        brand: 'HAVIT',
        is_featured: true,
        tags: JSON.stringify(['gamepad', 'controller', 'gaming', 'wireless']),
      },

      // ==================== FURNITURE (5 products) ====================
      {
        name: 'Modern L-Shape Sectional Sofa',
        slug: 'modern-l-shape-sectional-sofa',
        description: 'Contemporary L-shaped sofa with premium fabric upholstery. Reversible chaise and solid wood legs.',
        price: 899.00,
        original_price: 1199.00,
        discount: 25,
        thumbnail: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
        stock: 8,
        category: 'furniture',
        brand: 'ModernHome',
        is_featured: true,
        colors: JSON.stringify(['Charcoal Grey', 'Beige', 'Navy Blue', 'Forest Green']),
        tags: JSON.stringify(['sofa', 'living-room', 'sectional', 'modern']),
      },
      {
        name: 'Ergonomic Standing Desk',
        slug: 'ergonomic-standing-desk',
        description: 'Electric height-adjustable desk with memory presets. Spacious 60" x 30" bamboo top and cable management.',
        price: 549.00,
        original_price: 699.00,
        discount: 21,
        thumbnail: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400',
        stock: 20,
        category: 'furniture',
        brand: 'FlexiSpot',
        is_new: true,
        colors: JSON.stringify(['Natural Bamboo', 'White', 'Black']),
        tags: JSON.stringify(['desk', 'office', 'standing-desk', 'ergonomic']),
      },
      {
        name: 'Solid Oak Bookshelf',
        slug: 'solid-oak-bookshelf',
        description: 'Handcrafted solid oak bookshelf with 5 shelves. Classic design fits any home decor.',
        price: 399.00,
        original_price: 499.00,
        discount: 20,
        thumbnail: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=400',
        stock: 15,
        category: 'furniture',
        brand: 'WoodCraft',
        colors: JSON.stringify(['Natural Oak', 'Walnut', 'White Oak']),
        tags: JSON.stringify(['bookshelf', 'storage', 'wood', 'classic']),
      },
      {
        name: 'Memory Foam King Mattress',
        slug: 'memory-foam-king-mattress',
        description: '12-inch gel-infused memory foam mattress. CertiPUR-US certified, medium-firm support, and cooling technology.',
        price: 799.00,
        original_price: 999.00,
        discount: 20,
        thumbnail: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400',
        stock: 12,
        category: 'furniture',
        brand: 'DreamCloud',
        is_new: true,
        is_featured: true,
        sizes: JSON.stringify(['Twin', 'Full', 'Queen', 'King', 'Cal King']),
        tags: JSON.stringify(['mattress', 'bedroom', 'memory-foam', 'sleep']),
      },
      {
        name: 'S-Series Comfort Chair',
        slug: 's-series-comfort-chair',
        description: 'Ergonomic office chair with lumbar support and breathable mesh back. Adjustable armrests and headrest.',
        price: 375.00,
        original_price: 400.00,
        discount: 6,
        thumbnail: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400',
        stock: 15,
        category: 'furniture',
        brand: 'Comfort Plus',
        is_new: true,
        colors: JSON.stringify(['Black', 'Grey', 'Blue']),
        tags: JSON.stringify(['chair', 'office', 'ergonomic', 'mesh']),
      },

      // ==================== SPORTS (5 products) ====================
      {
        name: 'Premium Yoga Mat',
        slug: 'premium-yoga-mat',
        description: 'Extra thick 6mm eco-friendly TPE yoga mat. Non-slip surface, alignment lines, and carrying strap included.',
        price: 49.00,
        original_price: 65.00,
        discount: 25,
        thumbnail: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400',
        stock: 100,
        category: 'sports',
        brand: 'Gaiam',
        colors: JSON.stringify(['Purple', 'Blue', 'Green', 'Pink', 'Black']),
        tags: JSON.stringify(['yoga', 'fitness', 'mat', 'exercise']),
      },
      {
        name: 'Adjustable Dumbbell Set',
        slug: 'adjustable-dumbbell-set',
        description: 'Space-saving adjustable dumbbells from 5-52.5 lbs each. Quick-change weight system with secure lock.',
        price: 349.00,
        original_price: 429.00,
        discount: 19,
        thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400',
        stock: 25,
        category: 'sports',
        brand: 'Bowflex',
        is_featured: true,
        tags: JSON.stringify(['dumbbells', 'weights', 'strength', 'home-gym']),
      },
      {
        name: 'ProForm Treadmill Pro 3000',
        slug: 'proform-treadmill-pro-3000',
        description: 'Commercial-grade treadmill with 10" HD touchscreen. iFIT enabled, 12% incline, and SpaceSaver design.',
        price: 1299.00,
        original_price: 1599.00,
        discount: 19,
        thumbnail: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=400',
        stock: 8,
        category: 'sports',
        brand: 'ProForm',
        is_new: true,
        tags: JSON.stringify(['treadmill', 'cardio', 'fitness', 'home-gym']),
      },
      {
        name: 'Spalding NBA Official Basketball',
        slug: 'spalding-nba-official-basketball',
        description: 'Official NBA game ball with full-grain leather. Indoor use only, official size and weight.',
        price: 169.00,
        original_price: 199.00,
        discount: 15,
        thumbnail: 'https://images.unsplash.com/photo-1494199505258-5f95387f933c?w=400',
        stock: 50,
        category: 'sports',
        brand: 'Spalding',
        tags: JSON.stringify(['basketball', 'nba', 'sports', 'ball']),
      },
      {
        name: 'Fitbit Charge 6',
        slug: 'fitbit-charge-6',
        description: 'Advanced fitness tracker with built-in GPS, heart rate monitoring, and 7-day battery. Google apps integration.',
        price: 159.00,
        original_price: 179.00,
        discount: 11,
        thumbnail: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400',
        stock: 60,
        category: 'sports',
        brand: 'Fitbit',
        is_new: true,
        is_featured: true,
        colors: JSON.stringify(['Black', 'Coral', 'Porcelain/Silver']),
        tags: JSON.stringify(['fitness-tracker', 'smartwatch', 'fitbit', 'health']),
      },

      // ==================== HEALTH & BEAUTY (4 products) ====================
      {
        name: 'Dyson Supersonic Hair Dryer',
        slug: 'dyson-supersonic-hair-dryer',
        description: 'Intelligent heat control to protect hair shine. Powerful digital motor, magnetic attachments, and multiple styling modes.',
        price: 399.00,
        original_price: 449.00,
        discount: 11,
        thumbnail: 'https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=400',
        stock: 20,
        category: 'health-beauty',
        brand: 'Dyson',
        is_featured: true,
        colors: JSON.stringify(['Iron/Fuchsia', 'Nickel/Copper', 'Black/Nickel']),
        tags: JSON.stringify(['hair-dryer', 'beauty', 'dyson', 'styling']),
      },
      {
        name: 'Philips Norelco Shaver 9000',
        slug: 'philips-norelco-shaver-9000',
        description: 'Premium electric shaver with SenseIQ technology. Dual SteelPrecision blades, wet & dry use, and 60-min runtime.',
        price: 229.00,
        original_price: 279.00,
        discount: 18,
        thumbnail: 'https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=400',
        stock: 35,
        category: 'health-beauty',
        brand: 'Philips',
        is_new: true,
        tags: JSON.stringify(['shaver', 'grooming', 'philips', 'electric']),
      },
      {
        name: 'La Roche-Posay Skincare Set',
        slug: 'la-roche-posay-skincare-set',
        description: 'Complete skincare routine with cleanser, serum, moisturizer, and sunscreen. Dermatologist recommended for all skin types.',
        price: 89.00,
        original_price: 120.00,
        discount: 26,
        thumbnail: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
        stock: 45,
        category: 'health-beauty',
        brand: 'La Roche-Posay',
        is_featured: true,
        tags: JSON.stringify(['skincare', 'beauty', 'gift-set', 'moisturizer']),
      },
      {
        name: 'Oral-B iO Series 9 Toothbrush',
        slug: 'oral-b-io-series-9-toothbrush',
        description: 'Revolutionary magnetic drive technology. AI recognition, 3D tracking, and interactive color display.',
        price: 279.00,
        original_price: 329.00,
        discount: 15,
        thumbnail: 'https://images.unsplash.com/photo-1559467278-020d0b8e8e0c?w=400',
        stock: 30,
        category: 'health-beauty',
        brand: 'Oral-B',
        is_new: true,
        colors: JSON.stringify(['Black Onyx', 'Rose Quartz', 'White Alabaster']),
        tags: JSON.stringify(['toothbrush', 'oral-care', 'electric', 'smart']),
      },
    ];

    let createdCount = 0;
    for (const product of products) {
      // Get category ID
      const [cats] = await pool.execute<any[]>(
        'SELECT id FROM categories WHERE slug = ?',
        [product.category]
      );
      const categoryId = cats[0]?.id;

      if (!categoryId) {
        console.log(`⚠️ Category not found for: ${product.name}`);
        continue;
      }

      await pool.execute(
        `INSERT INTO products (name, slug, description, price, original_price, discount, thumbnail, stock, category_id, brand, is_new, is_featured, tags, colors, sizes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
           price = VALUES(price), 
           stock = VALUES(stock),
           description = VALUES(description),
           original_price = VALUES(original_price),
           discount = VALUES(discount),
           thumbnail = VALUES(thumbnail),
           is_new = VALUES(is_new),
           is_featured = VALUES(is_featured),
           tags = VALUES(tags),
           colors = VALUES(colors),
           sizes = VALUES(sizes)`,
        [
          product.name,
          product.slug,
          product.description,
          product.price,
          product.original_price || null,
          product.discount || 0,
          product.thumbnail,
          product.stock,
          categoryId,
          product.brand,
          product.is_new || false,
          product.is_featured || false,
          product.tags || '[]',
          product.colors || '[]',
          product.sizes || '[]',
        ]
      );
      createdCount++;
    }
    console.log(`✅ ${createdCount} products created/updated`);

    console.log('\n✅ Database seeding completed!');
    console.log('\n📦 Products Summary:');
    console.log('  - Electronics: 8 products');
    console.log('  - Fashion: 7 products');
    console.log('  - Gaming: 6 products');
    console.log('  - Furniture: 5 products');
    console.log('  - Sports: 5 products');
    console.log('  - Health & Beauty: 4 products');
    console.log('  - Total: 35 products');
    console.log('\nTest credentials:');
    console.log('  Super Admin: superadmin@agora.com / SuperAdmin@123');
    console.log('  Admin:       admin@agora.com / Admin@123');
    console.log('  Moderator:   moderator@agora.com / Moderator@123');
    console.log('  Editor:      editor@agora.com / Editor@123');
    console.log('  Viewer:      viewer@agora.com / Viewer@123');
    console.log('  Customer:    customer@example.com / Customer@123');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

seedDatabase();
