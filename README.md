# AGORA E-Commerce Platform

A modern, full-featured e-commerce platform built with React, TypeScript, and Node.js.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Admin Panel](#admin-panel)
- [User Guide](#user-guide)
- [Development](#development)
- [Troubleshooting](#troubleshooting)

---

## Overview

AGORA is a complete e-commerce solution that includes:

- **Customer-facing storefront** - Browse products, manage cart, checkout
- **Admin dashboard** - Manage products, orders, users, and settings
- **RESTful API** - Backend services for all operations
- **Authentication system** - Secure login with JWT tokens

---

## Features

### For Customers

| Feature | Description |
|---------|-------------|
| Product Browsing | View products by category, search, filter by price/rating |
| Shopping Cart | Add/remove items, update quantities |
| Wishlist | Save favorite products for later |
| User Account | Register, login, manage profile |
| Order History | View past orders and track status |
| Reviews | Read and write product reviews |

### For Administrators

| Feature | Description |
|---------|-------------|
| Dashboard | View sales stats, orders, and analytics |
| Product Management | Create, edit, delete products with multiple images |
| Order Management | View orders, update status, add tracking |
| User Management | View users, change roles, reset passwords |
| Category Management | Organize products into categories |
| Messages | View and respond to customer inquiries |

---

## Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| TypeScript | Type safety |
| Redux Toolkit | State management |
| RTK Query | API data fetching and caching |
| React Router | Navigation |
| Tailwind CSS | Styling |
| Vite | Build tool |

### Backend

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| TypeScript | Type safety |
| MySQL | Database |
| JWT | Authentication |
| Multer | File uploads |
| bcrypt | Password hashing |

---

## Project Structure

```
Agora-ecommerce-catalog/
├── src/                      # Frontend source code
│   ├── api/                  # API integration (RTK Query)
│   │   ├── adminApi.ts       # Admin endpoints
│   │   ├── authApi.ts        # Authentication endpoints
│   │   ├── productApi.ts     # Product endpoints
│   │   └── userApi.ts        # User endpoints
│   ├── components/           # Reusable UI components
│   │   ├── admin/            # Admin-specific components
│   │   ├── common/           # Shared components (Button, Modal, etc.)
│   │   ├── layout/           # Header, Footer, Sidebar
│   │   └── product/          # Product cards, lists
│   ├── pages/                # Page components
│   │   ├── admin/            # Admin panel pages
│   │   ├── home_page.tsx     # Homepage
│   │   ├── Products.tsx      # Product listing
│   │   ├── ProductDetail.tsx # Single product view
│   │   ├── Cart.tsx          # Shopping cart
│   │   ├── Checkout.tsx      # Checkout process
│   │   └── Account.tsx       # User account
│   ├── redux/                # Redux store configuration
│   │   ├── slices/           # Redux slices (cart, auth, wishlist)
│   │   └── store.ts          # Store setup
│   ├── hooks/                # Custom React hooks
│   ├── utils/                # Helper functions
│   └── types/                # TypeScript type definitions
│
├── backend/                  # Backend source code
│   └── src/
│       ├── config/           # Database, environment config
│       ├── controllers/      # Request handlers
│       │   └── admin/        # Admin-specific controllers
│       ├── middleware/       # Auth, validation, error handling
│       ├── models/           # Database models
│       ├── routes/           # API route definitions
│       ├── services/         # Business logic
│       ├── validators/       # Input validation rules
│       └── utils/            # Helper utilities
│
├── public/                   # Static assets
└── dist/                     # Production build output
```

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- MySQL 8.0 or higher
- npm or yarn

### Installation

#### 1. Clone the repository

```bash
git clone <repository-url>
cd Agora-ecommerce-catalog
```

#### 2. Install frontend dependencies

```bash
npm install
```

#### 3. Install backend dependencies

```bash
cd backend
npm install
cd ..
```

#### 4. Set up the database

```bash
# Create a MySQL database
mysql -u root -p
CREATE DATABASE agora_ecommerce;
exit

# Run migrations
cd backend
npm run migrate
npm run seed  # Optional: add sample data
cd ..
```

#### 5. Configure environment variables

Create `.env` files (see [Environment Variables](#environment-variables))

#### 6. Start the development servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

#### 7. Open the application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

---

## Environment Variables

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

### Backend (backend/.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=agora_ecommerce

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_REFRESH_EXPIRES_IN=7d

# Optional: AWS S3 for image uploads
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_BUCKET_NAME=
AWS_REGION=
```

---

## API Documentation

### Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Register new user |
| `/api/auth/login` | POST | Login user |
| `/api/auth/admin/login` | POST | Login admin |
| `/api/auth/refresh` | POST | Refresh access token |
| `/api/auth/logout` | POST | Logout user |

### Products

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/products` | GET | Get all products (with filters) |
| `/api/products/:id` | GET | Get product by ID |
| `/api/products/featured` | GET | Get featured products |
| `/api/products/new-arrivals` | GET | Get new products |
| `/api/products/best-selling` | GET | Get best sellers |

### Categories

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/categories` | GET | Get all categories |
| `/api/categories/:slug` | GET | Get category by slug |

### User

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/user/me` | GET | Yes | Get current user profile |
| `/api/user/me` | PUT | Yes | Update user profile |

### Cart

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/cart` | GET | Yes | Get user's cart |
| `/api/cart` | POST | Yes | Add item to cart |
| `/api/cart/:itemId` | PUT | Yes | Update cart item |
| `/api/cart/:itemId` | DELETE | Yes | Remove from cart |

### Orders

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/orders` | GET | Yes | Get user's orders |
| `/api/orders/:id` | GET | Yes | Get order details |
| `/api/orders` | POST | Yes | Create new order |

### Admin Endpoints

All admin endpoints require authentication and admin role.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/dashboard/stats` | GET | Get dashboard statistics |
| `/api/admin/products` | POST | Create product |
| `/api/admin/products/:id` | PUT | Update product |
| `/api/admin/products/:id` | DELETE | Delete product |
| `/api/admin/products/:id/images` | POST | Upload product images |
| `/api/admin/users` | GET | Get all users |
| `/api/admin/users/:id/role` | PUT | Update user role |
| `/api/admin/users/:id/status` | PUT | Update user status |
| `/api/admin/users/:id/password` | PUT | Reset user password |
| `/api/admin/orders` | GET | Get all orders |
| `/api/admin/orders/:id/status` | PUT | Update order status |

---

## Admin Panel

### Accessing the Admin Panel

1. Navigate to `/admin/login`
2. Login with admin credentials
3. You'll be redirected to the dashboard

### Default Test Accounts

After running `npm run seed`, you can use these accounts:

| Role | Email | Password |
|------|-------|----------|
| Super Admin | superadmin@agora.com | SuperAdmin@123 |
| Admin | admin@agora.com | Admin@123 |
| Moderator | moderator@agora.com | Moderator@123 |
| Editor | editor@agora.com | Editor@123 |
| Viewer | viewer@agora.com | Viewer@123 |
| Customer | customer@example.com | Customer@123 |

### User Roles

| Role | Permissions |
|------|-------------|
| super_admin | Full access to everything |
| admin | Manage products, orders, users (not other admins) |
| moderator | Edit products, view/update orders, view users |
| editor | Create/edit products, view categories |
| viewer | Read-only access |
| customer | No admin access |

### Admin Features

#### Dashboard
- View total sales, orders, users
- See pending orders count
- Monitor new registrations

#### Products Management
- Add new products with multiple images
- Edit product details, price, stock
- Set featured/new badges
- Delete products (soft delete)

#### Orders Management
- View all orders with status
- Update order status (pending → processing → shipped → delivered)
- Add tracking numbers

#### Users Management
- View all registered users
- Change user roles
- Activate/suspend accounts
- Reset user passwords

---

## User Guide

### Shopping Flow

1. **Browse Products**
   - Visit homepage or products page
   - Use filters (category, price, rating)
   - Search by product name

2. **Add to Cart**
   - Click "Add to Cart" on any product
   - Select color/size if available
   - Adjust quantity in cart

3. **Checkout**
   - Review cart items
   - Enter shipping address
   - Select payment method
   - Place order

4. **Track Order**
   - Go to Account → Orders
   - View order status and tracking

### Account Management

- **Register**: Create account with email and password
- **Login**: Access your account
- **Profile**: Update name, phone, avatar
- **Addresses**: Manage shipping addresses
- **Orders**: View order history

---

## Development

### Available Scripts

#### Frontend

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
npm run test      # Run tests
```

#### Backend

```bash
cd backend
npm run dev       # Start with hot reload
npm run build     # Compile TypeScript
npm run start     # Start production server
npm run migrate   # Run database migrations
npm run seed      # Seed sample data
npm run test      # Run tests
```

### Code Style

- Use TypeScript for all code
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful commit messages

### Adding New Features

1. **Frontend Component**
   ```
   src/components/feature/FeatureName.tsx
   ```

2. **API Endpoint**
   ```
   src/api/featureApi.ts (frontend)
   backend/src/routes/feature.routes.ts (backend)
   ```

3. **Redux State**
   ```
   src/redux/slices/featureSlice.ts
   ```

---

## Troubleshooting

### Common Issues

#### "Cannot connect to database"

```bash
# Check MySQL is running
sudo systemctl status mysql

# Verify credentials in backend/.env
```

#### "401 Unauthorized" errors

- Token may have expired
- Login again to get new tokens
- Check if user has required role

#### "CORS error"

- Ensure backend CORS config allows frontend URL
- Check `backend/src/config/cors.ts`

#### "422 Unprocessable Entity" on product creation

- Ensure all required fields are filled:
  - name, description, price, stock, categoryId, thumbnail
- Check browser console for validation errors

#### Images not uploading

- Check `backend/uploads/` directory exists
- Verify file size is under 5MB
- Only JPEG, PNG, GIF, WebP allowed

### Getting Help

If you encounter issues:

1. Check the browser console for errors
2. Check backend terminal for error logs
3. Verify environment variables are set
4. Ensure database migrations have run

---

## License

This project is for educational purposes as part of the ALX program.

---

## Contributors

- Built with care for the ALX Frontend Project

---

Made with React, Node.js, and TypeScript
