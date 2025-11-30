# Database Schema Documentation

This document describes the database structure for the AGORA e-commerce platform.

---

## Overview

AGORA uses MySQL as its database. The schema consists of the following main tables:

- `users` - User accounts and authentication
- `products` - Product catalog
- `product_images` - Multiple images per product
- `categories` - Product categories
- `orders` - Customer orders
- `order_items` - Items within orders
- `cart_items` - Shopping cart
- `wishlist_items` - User wishlists
- `reviews` - Product reviews
- `addresses` - Shipping/billing addresses
- `tokens` - JWT refresh tokens
- `contact_messages` - Customer inquiries

---

## Table Schemas

### users

Stores user account information.

| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Auto-increment ID |
| email | VARCHAR(255) | Unique email address |
| password_hash | VARCHAR(255) | Bcrypt hashed password |
| first_name | VARCHAR(100) | User's first name |
| last_name | VARCHAR(100) | User's last name |
| phone | VARCHAR(20) | Phone number (optional) |
| avatar | VARCHAR(500) | Profile image URL |
| role | ENUM | 'customer', 'admin', 'moderator', 'editor', 'viewer', 'super_admin' |
| status | ENUM | 'active', 'suspended', 'deleted' |
| email_verified | BOOLEAN | Email verification status |
| created_at | TIMESTAMP | Account creation date |
| updated_at | TIMESTAMP | Last update date |

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  avatar VARCHAR(500),
  role ENUM('customer', 'admin', 'moderator', 'editor', 'viewer', 'super_admin') DEFAULT 'customer',
  status ENUM('active', 'suspended', 'deleted') DEFAULT 'active',
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

### products

Stores product information.

| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Auto-increment ID |
| name | VARCHAR(255) | Product name |
| slug | VARCHAR(255) | URL-friendly name |
| description | TEXT | Product description |
| price | DECIMAL(10,2) | Current price |
| original_price | DECIMAL(10,2) | Original price (for discounts) |
| discount | INT | Discount percentage (0-100) |
| thumbnail | VARCHAR(500) | Main product image URL |
| stock | INT | Available quantity |
| category_id | INT (FK) | Reference to categories |
| brand | VARCHAR(100) | Brand name |
| tags | JSON | Array of tags |
| colors | JSON | Available colors |
| sizes | JSON | Available sizes |
| specifications | JSON | Product specs (key-value pairs) |
| rating | DECIMAL(2,1) | Average rating (0-5) |
| review_count | INT | Number of reviews |
| sold_count | INT | Number sold |
| is_new | BOOLEAN | Show "NEW" badge |
| is_featured | BOOLEAN | Show in featured section |
| status | ENUM | 'active', 'draft', 'deleted' |
| created_at | TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | Last update |

```sql
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  discount INT DEFAULT 0,
  thumbnail VARCHAR(500),
  stock INT DEFAULT 0,
  category_id INT,
  brand VARCHAR(100),
  tags JSON,
  colors JSON,
  sizes JSON,
  specifications JSON,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INT DEFAULT 0,
  sold_count INT DEFAULT 0,
  is_new BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  status ENUM('active', 'draft', 'deleted') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);
```

---

### product_images

Stores additional product images.

| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Auto-increment ID |
| product_id | INT (FK) | Reference to products |
| image_url | VARCHAR(500) | Image URL |
| sort_order | INT | Display order |

```sql
CREATE TABLE product_images (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  sort_order INT DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
```

---

### categories

Stores product categories.

| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Auto-increment ID |
| name | VARCHAR(100) | Category name |
| slug | VARCHAR(100) | URL-friendly name |
| icon | VARCHAR(100) | Icon name or emoji |
| image | VARCHAR(500) | Category image URL |
| parent_id | INT (FK) | Parent category (for subcategories) |
| created_at | TIMESTAMP | Creation date |

```sql
CREATE TABLE categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  icon VARCHAR(100),
  image VARCHAR(500),
  parent_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);
```

---

### orders

Stores customer orders.

| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Auto-increment ID |
| order_id | VARCHAR(50) | Human-readable order number |
| user_id | INT (FK) | Customer reference |
| subtotal | DECIMAL(10,2) | Total before shipping/tax |
| shipping | DECIMAL(10,2) | Shipping cost |
| tax | DECIMAL(10,2) | Tax amount |
| discount | DECIMAL(10,2) | Discount applied |
| total | DECIMAL(10,2) | Final total |
| status | ENUM | Order status |
| payment_method | VARCHAR(100) | Payment method used |
| payment_status | ENUM | Payment status |
| shipping_address | JSON | Shipping address details |
| billing_address | JSON | Billing address details |
| tracking_number | VARCHAR(100) | Shipping tracking number |
| estimated_delivery | DATE | Expected delivery date |
| notes | TEXT | Customer notes |
| created_at | TIMESTAMP | Order date |
| updated_at | TIMESTAMP | Last update |

```sql
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id VARCHAR(50) UNIQUE NOT NULL,
  user_id INT NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  shipping DECIMAL(10,2) DEFAULT 0,
  tax DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  payment_method VARCHAR(100),
  payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
  shipping_address JSON,
  billing_address JSON,
  tracking_number VARCHAR(100),
  estimated_delivery DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

### order_items

Stores items within orders.

| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Auto-increment ID |
| order_id | INT (FK) | Reference to orders |
| product_id | INT (FK) | Reference to products |
| product_name | VARCHAR(255) | Product name at time of order |
| product_thumbnail | VARCHAR(500) | Product image at time of order |
| quantity | INT | Quantity ordered |
| price | DECIMAL(10,2) | Price at time of order |
| color | VARCHAR(50) | Selected color |
| size | VARCHAR(50) | Selected size |

```sql
CREATE TABLE order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_id INT,
  product_name VARCHAR(255) NOT NULL,
  product_thumbnail VARCHAR(500),
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  color VARCHAR(50),
  size VARCHAR(50),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);
```

---

### reviews

Stores product reviews.

| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Auto-increment ID |
| product_id | INT (FK) | Product being reviewed |
| user_id | INT (FK) | Reviewer |
| rating | INT | Rating (1-5) |
| title | VARCHAR(255) | Review title |
| comment | TEXT | Review text |
| helpful_count | INT | "Was this helpful?" count |
| verified_purchase | BOOLEAN | User bought this product |
| created_at | TIMESTAMP | Review date |

```sql
CREATE TABLE reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  user_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title VARCHAR(255),
  comment TEXT,
  helpful_count INT DEFAULT 0,
  verified_purchase BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

### tokens

Stores JWT refresh tokens for authentication.

| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Auto-increment ID |
| user_id | INT (FK) | Token owner |
| token | VARCHAR(500) | Refresh token value |
| expires_at | TIMESTAMP | Expiration date |
| created_at | TIMESTAMP | Creation date |

```sql
CREATE TABLE tokens (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  token VARCHAR(500) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## Indexes

For optimal performance, the following indexes are recommended:

```sql
-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);

-- Products
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_featured ON products(is_featured);

-- Orders
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at);

-- Reviews
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
```

---

## Relationships Diagram

```
users ──────────────── tokens (1:N)
  │
  ├──────────────── orders (1:N) ──── order_items (1:N) ──── products
  │
  ├──────────────── reviews (1:N) ─────────────────────────── products
  │
  ├──────────────── cart_items (1:N) ────────────────────────┘
  │
  ├──────────────── wishlist_items (1:N) ────────────────────┘
  │
  └──────────────── addresses (1:N)

categories ──── products (1:N) ──── product_images (1:N)
```

---

## Data Types Reference

### JSON Fields

**tags** (products):
```json
["electronics", "gaming", "sale"]
```

**colors** (products):
```json
["#FF0000", "#00FF00", "#0000FF"]
```

**sizes** (products):
```json
["XS", "S", "M", "L", "XL"]
```

**specifications** (products):
```json
{
  "Weight": "250g",
  "Dimensions": "15x10x5 cm",
  "Material": "Plastic"
}
```

**shipping_address** (orders):
```json
{
  "name": "John Doe",
  "street": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "country": "USA",
  "phone": "+1234567890"
}
```

