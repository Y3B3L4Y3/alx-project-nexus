# AGORA E-Commerce Backend API

A production-ready Node.js/Express.js backend API for the AGORA E-Commerce platform.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MySQL
- **Authentication**: JWT (Access + Refresh Tokens)
- **Password Hashing**: bcrypt
- **Validation**: express-validator
- **Testing**: Jest + Supertest

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL 8.0+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create your `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your database credentials and secrets.

4. Create the database:
```sql
CREATE DATABASE agora_ecommerce;
```

5. Run migrations:
```bash
npm run migrate
```

6. (Optional) Seed sample data:
```bash
npm run seed
```

### Running the Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update profile
- `DELETE /api/users/me` - Delete account

### Products
- `GET /api/products` - Get all products (paginated, filterable)
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/featured` - Get featured products
- `GET /api/products/new-arrivals` - Get new arrivals
- `GET /api/products/flash-sale` - Get flash sale products
- `GET /api/products/best-selling` - Get best selling products
- `GET /api/products/:id/reviews` - Get product reviews

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get category by slug
- `GET /api/categories/:slug/products` - Get products in category

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update cart item
- `DELETE /api/cart/:itemId` - Remove item
- `DELETE /api/cart` - Clear cart

### Wishlist
- `GET /api/wishlist` - Get wishlist
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist/:productId` - Remove from wishlist
- `POST /api/wishlist/:productId/toggle` - Toggle wishlist item

### Orders
- `GET /api/orders` - Get user orders
- `GET /api/orders/:orderId` - Get order details
- `POST /api/orders` - Create order
- `POST /api/orders/:orderId/cancel` - Cancel order

### Addresses
- `GET /api/addresses` - Get addresses
- `POST /api/addresses` - Add address
- `PUT /api/addresses/:id` - Update address
- `DELETE /api/addresses/:id` - Delete address

### Admin Endpoints
All admin endpoints require admin role.

- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id/status` - Update order status
- `GET /api/admin/users` - Get all users
- `GET /api/admin/messages` - Get contact messages
- `GET /api/admin/settings` - Get store settings

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Express middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── types/          # TypeScript types
│   ├── utils/          # Utility functions
│   ├── validators/     # Request validators
│   └── app.ts          # Main application
├── migrations/         # Database migrations
├── seeds/              # Database seeders
├── tests/              # Test files
└── package.json
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment | development |
| PORT | Server port | 5000 |
| DB_HOST | Database host | localhost |
| DB_PORT | Database port | 3306 |
| DB_NAME | Database name | agora_ecommerce |
| DB_USER | Database user | root |
| DB_PASSWORD | Database password | |
| JWT_ACCESS_SECRET | JWT access token secret | |
| JWT_REFRESH_SECRET | JWT refresh token secret | |
| JWT_ACCESS_EXPIRY | Access token expiry | 15m |
| JWT_REFRESH_EXPIRY | Refresh token expiry | 7d |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:5173 |

## Default Credentials

After seeding:
- **Admin**: admin@agora.com / Admin@123
- **Customer**: customer@example.com / Customer@123

## License

ISC

