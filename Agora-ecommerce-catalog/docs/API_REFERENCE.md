# API Reference

Complete API documentation for the AGORA e-commerce backend.

**Base URL:** `http://localhost:5000/api`

---

## Table of Contents

- [Authentication](#authentication)
- [Products](#products)
- [Categories](#categories)
- [Cart](#cart)
- [Orders](#orders)
- [User Profile](#user-profile)
- [Reviews](#reviews)
- [Admin Endpoints](#admin-endpoints)
- [Response Formats](#response-formats)
- [Error Codes](#error-codes)

---

## Authentication

### Register User

Create a new user account.

```http
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "Registration successful"
}
```

---

### Login User

Authenticate an existing user.

```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### Admin Login

Authenticate an admin user.

```http
POST /auth/admin/login
```

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "AdminPass123!"
}
```

**Note:** Only users with role `admin`, `moderator`, or `super_admin` can use this endpoint.

---

### Refresh Token

Get a new access token using a refresh token.

```http
POST /auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### Logout

Invalidate the current refresh token.

```http
POST /auth/logout
```

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Products

### Get All Products

Retrieve a paginated list of products with optional filters.

```http
GET /products
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 12, max: 100) |
| category | string | Filter by category slug |
| minPrice | number | Minimum price |
| maxPrice | number | Maximum price |
| rating | number | Minimum rating (0-5) |
| inStock | boolean | Only show in-stock items |
| brand | string | Filter by brand name |
| search | string | Search in name, description, brand |
| sortBy | string | Sort order (see below) |

**Sort Options:**
- `price-asc` - Price low to high
- `price-desc` - Price high to low
- `rating` - Highest rated first
- `newest` - Newest first
- `popular` - Best selling first

**Example:**
```http
GET /products?page=1&limit=12&category=electronics&sortBy=price-asc
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Wireless Headphones",
      "slug": "wireless-headphones",
      "description": "High-quality wireless headphones",
      "price": 99.99,
      "originalPrice": 149.99,
      "discount": 33,
      "thumbnail": "/uploads/headphones.jpg",
      "images": ["/uploads/headphones.jpg", "/uploads/headphones-2.jpg"],
      "rating": 4.5,
      "reviewCount": 128,
      "stock": 50,
      "categoryId": 1,
      "brand": "AudioTech",
      "isNew": true,
      "isFeatured": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 100,
    "totalPages": 9
  }
}
```

---

### Get Product by ID

Retrieve a single product by its ID.

```http
GET /products/:id
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Wireless Headphones",
    "slug": "wireless-headphones",
    "description": "High-quality wireless headphones with noise cancellation",
    "price": 99.99,
    "originalPrice": 149.99,
    "discount": 33,
    "thumbnail": "/uploads/headphones.jpg",
    "images": ["/uploads/headphones.jpg", "/uploads/headphones-2.jpg"],
    "rating": 4.5,
    "reviewCount": 128,
    "stock": 50,
    "categoryId": 1,
    "categoryName": "Electronics",
    "categorySlug": "electronics",
    "brand": "AudioTech",
    "tags": ["audio", "wireless", "bluetooth"],
    "colors": ["#000000", "#FFFFFF", "#0000FF"],
    "sizes": [],
    "specifications": {
      "Battery Life": "30 hours",
      "Connectivity": "Bluetooth 5.0",
      "Weight": "250g"
    },
    "isNew": true,
    "isFeatured": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-20T14:45:00Z"
  }
}
```

---

### Get Featured Products

Retrieve products marked as featured.

```http
GET /products/featured
```

**Response:** Array of products (max 8)

---

### Get New Arrivals

Retrieve recently added products.

```http
GET /products/new-arrivals
```

**Response:** Array of products marked as new

---

### Get Best Selling Products

Retrieve top-selling products.

```http
GET /products/best-selling?limit=8
```

---

### Get Related Products

Retrieve products related to a specific product.

```http
GET /products/:id/related?limit=4
```

---

## Categories

### Get All Categories

Retrieve all product categories.

```http
GET /categories
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Electronics",
      "slug": "electronics",
      "icon": "📱",
      "image": "/images/electronics.jpg",
      "productCount": 150
    },
    {
      "id": 2,
      "name": "Fashion",
      "slug": "fashion",
      "icon": "👕",
      "image": "/images/fashion.jpg",
      "productCount": 200
    }
  ]
}
```

---

### Get Category by Slug

Retrieve a category with its products.

```http
GET /categories/:slug
```

---

## Cart

**Note:** All cart endpoints require authentication.

### Get Cart

Retrieve the current user's cart.

```http
GET /cart
```

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "productId": 5,
        "productName": "Wireless Headphones",
        "productThumbnail": "/uploads/headphones.jpg",
        "price": 99.99,
        "quantity": 2,
        "color": "#000000",
        "size": null
      }
    ],
    "subtotal": 199.98,
    "itemCount": 2
  }
}
```

---

### Add to Cart

Add an item to the cart.

```http
POST /cart
```

**Request Body:**
```json
{
  "productId": 5,
  "quantity": 1,
  "color": "#000000",
  "size": "M"
}
```

---

### Update Cart Item

Update quantity of a cart item.

```http
PUT /cart/:itemId
```

**Request Body:**
```json
{
  "quantity": 3
}
```

---

### Remove from Cart

Remove an item from the cart.

```http
DELETE /cart/:itemId
```

---

### Clear Cart

Remove all items from the cart.

```http
DELETE /cart
```

---

## Orders

**Note:** All order endpoints require authentication.

### Get User Orders

Retrieve orders for the current user.

```http
GET /orders
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number |
| limit | number | Items per page |
| status | string | Filter by status |

---

### Get Order by ID

Retrieve a specific order.

```http
GET /orders/:id
```

---

### Create Order

Place a new order.

```http
POST /orders
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": 5,
      "quantity": 2,
      "color": "#000000",
      "size": "M"
    }
  ],
  "shippingAddress": {
    "name": "John Doe",
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA",
    "phone": "+1234567890"
  },
  "billingAddress": {
    "name": "John Doe",
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "credit_card",
  "notes": "Please leave at door"
}
```

---

## User Profile

**Note:** All profile endpoints require authentication.

### Get Profile

Retrieve current user's profile.

```http
GET /user/me
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "avatar": "/uploads/avatar.jpg",
    "role": "customer",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### Update Profile

Update current user's profile.

```http
PUT /user/me
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1987654321",
  "avatar": "https://example.com/avatar.jpg"
}
```

---

## Reviews

### Get Product Reviews

Retrieve reviews for a product.

```http
GET /products/:productId/reviews
```

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page
- `sort` - Sort order (`newest`, `oldest`, `helpful`)

---

### Add Review

Add a review for a product (requires authentication).

```http
POST /products/:productId/reviews
```

**Request Body:**
```json
{
  "rating": 5,
  "title": "Great product!",
  "comment": "This is exactly what I was looking for. Highly recommended!"
}
```

---

## Admin Endpoints

**Note:** All admin endpoints require authentication and an admin role.

**Headers:**
```
Authorization: Bearer <accessToken>
```

### Dashboard

#### Get Dashboard Stats

```http
GET /admin/dashboard/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalSales": 125000,
    "totalOrders": 450,
    "totalUsers": 1200,
    "totalRevenue": 98000,
    "pendingOrders": 15,
    "newOrdersToday": 8,
    "newUsersToday": 3,
    "newMessagesToday": 5
  }
}
```

---

### Product Management

#### Create Product

```http
POST /admin/products
```

**Request Body:**
```json
{
  "name": "New Product",
  "description": "Product description here",
  "price": 99.99,
  "originalPrice": 149.99,
  "discount": 33,
  "thumbnail": "https://example.com/image.jpg",
  "stock": 100,
  "categoryId": 1,
  "brand": "BrandName",
  "tags": ["new", "sale"],
  "colors": ["#FF0000", "#0000FF"],
  "sizes": ["S", "M", "L"],
  "isNew": true,
  "isFeatured": false
}
```

---

#### Update Product

```http
PUT /admin/products/:id
```

---

#### Delete Product

```http
DELETE /admin/products/:id
```

**Note:** This performs a soft delete (sets status to 'deleted')

---

#### Upload Product Images

```http
POST /admin/products/:id/images
Content-Type: multipart/form-data
```

**Form Data:**
- `images` - Multiple image files (max 10, max 5MB each)

---

#### Delete Product Image

```http
DELETE /admin/products/:productId/images/:imageId
```

---

### User Management

#### Get All Users

```http
GET /admin/users?page=1&limit=20&role=customer&search=john
```

---

#### Update User Role

```http
PUT /admin/users/:id/role
```

**Request Body:**
```json
{
  "role": "moderator"
}
```

---

#### Update User Status

```http
PUT /admin/users/:id/status
```

**Request Body:**
```json
{
  "status": "suspended"
}
```

---

#### Reset User Password

```http
PUT /admin/users/:id/password
```

**Request Body:**
```json
{
  "newPassword": "NewSecurePass123!"
}
```

---

### Order Management

#### Get All Orders

```http
GET /admin/orders?page=1&limit=20&status=pending
```

---

#### Update Order Status

```http
PUT /admin/orders/:id/status
```

**Request Body:**
```json
{
  "status": "shipped"
}
```

---

#### Update Tracking

```http
PUT /admin/orders/:id/tracking
```

**Request Body:**
```json
{
  "trackingNumber": "1Z999AA10123456784",
  "estimatedDelivery": "2024-02-01"
}
```

---

## Response Formats

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Paginated Response

```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 100,
    "totalPages": 9
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message here",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation failed |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

---

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **General endpoints:** 100 requests per 15 minutes
- **Auth endpoints:** 10 requests per 15 minutes
- **File uploads:** 20 requests per hour

When rate limited, you'll receive:
```json
{
  "success": false,
  "error": "Too many requests. Please try again later."
}
```

