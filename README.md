# AGORA E-Commerce Platform

A modern, full-featured e-commerce platform built with React, TypeScript, and Node.js.

![AGORA](https://img.shields.io/badge/AGORA-E--Commerce-blue)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Admin Panel](#admin-panel)
- [Deployment](#deployment)
- [Development](#development)
- [Troubleshooting](#troubleshooting)

---

## 🌟 Overview

AGORA is a complete e-commerce solution that includes:

- **Customer-facing storefront** - Browse products, manage cart, checkout
- **Admin dashboard** - Manage products, orders, users, and settings
- **RESTful API** - Backend services for all operations
- **Authentication system** - Secure login with JWT tokens

---

## ✨ Features

### For Customers

| Feature | Description |
|---------|-------------|
| 🛍️ Product Browsing | View products by category, search, filter by price/rating |
| 🛒 Shopping Cart | Add/remove items, update quantities |
| ❤️ Wishlist | Save favorite products for later |
| 👤 User Account | Register, login, manage profile |
| 📦 Order History | View past orders and track status |
| ⭐ Reviews | Read and write product reviews |
| 📱 Responsive Design | Works on desktop, tablet, and mobile |
| 🔄 Infinite Scroll | Load products dynamically as you scroll |

### For Administrators

| Feature | Description |
|---------|-------------|
| 📊 Dashboard | View sales stats, orders, and analytics |
| 📦 Product Management | Create, edit, delete products with multiple images |
| 📋 Order Management | View orders, update status, add tracking |
| 👥 User Management | View users, change roles, reset passwords |
| 🏷️ Category Management | Organize products into categories |
| 💬 Messages | View and respond to customer inquiries |
| 🔐 Role-Based Access | Different permission levels for staff |

---

## 🛠️ Tech Stack

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

## 📁 Project Structure

```
alx-project-nexus/
├── Agora-ecommerce-catalog/
│   ├── frontend/                 # Frontend React application
│   │   ├── src/
│   │   │   ├── api/              # API integration (RTK Query)
│   │   │   │   ├── adminApi.ts   # Admin endpoints
│   │   │   │   ├── authApi.ts    # Authentication endpoints
│   │   │   │   ├── productApi.ts # Product endpoints
│   │   │   │   └── userApi.ts    # User endpoints
│   │   │   ├── components/       # Reusable UI components
│   │   │   │   ├── admin/        # Admin-specific components
│   │   │   │   ├── common/       # Shared components (Button, Modal)
│   │   │   │   ├── layout/       # Header, Footer, Sidebar
│   │   │   │   └── product/      # Product cards, lists
│   │   │   ├── pages/            # Page components
│   │   │   │   ├── admin/        # Admin panel pages
│   │   │   │   ├── home_page.tsx # Homepage
│   │   │   │   ├── Products.tsx  # Product listing
│   │   │   │   ├── Cart.tsx      # Shopping cart
│   │   │   │   └── Checkout.tsx  # Checkout process
│   │   │   ├── redux/            # Redux store configuration
│   │   │   │   ├── slices/       # Redux slices (cart, auth, wishlist)
│   │   │   │   └── store.ts      # Store setup
│   │   │   ├── hooks/            # Custom React hooks
│   │   │   ├── utils/            # Helper functions
│   │   │   └── types/            # TypeScript type definitions
│   │   ├── public/               # Static assets
│   │   ├── dist/                 # Production build output
│   │   ├── package.json          # Frontend dependencies
│   │   ├── vite.config.ts        # Vite configuration
│   │   ├── tailwind.config.js    # Tailwind CSS configuration
│   │   └── tsconfig.json         # TypeScript configuration
│   │
│   ├── backend/                  # Backend Node.js application
│   │   └── src/
│   │       ├── config/           # Database, environment config
│   │       ├── controllers/      # Request handlers
│   │       │   └── admin/        # Admin-specific controllers
│   │       ├── middleware/       # Auth, validation, error handling
│   │       ├── models/           # Database models
│   │       ├── routes/           # API route definitions
│   │       ├── services/         # Business logic
│   │       ├── validators/       # Input validation rules
│   │       └── utils/            # Helper utilities
│   │
│   ├── docs/                     # Documentation files
│   └── vercel.json               # Vercel deployment config
│
├── README.md                     # This file
└── vercel.json                   # Root Vercel config
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- MySQL 8.0 or higher
- npm or yarn

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/Y3B3L4Y3/alx-project-nexus.git
cd alx-project-nexus/Agora-ecommerce-catalog
```

#### 2. Install frontend dependencies

```bash
cd frontend
npm install
cd ..
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
cd frontend
npm run dev
```

#### 7. Open the application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

---

## 🔐 Environment Variables

### Frontend (frontend/.env)

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
JWT_ACCESS_SECRET=your_access_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

---

## 📚 API Documentation

### Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Register new user |
| `/api/auth/login` | POST | Login user |
| `/api/auth/admin/login` | POST | Login admin |
| `/api/auth/refresh` | POST | Refresh access token |
| `/api/auth/logout` | POST | Logout user |
| `/api/auth/change-password` | POST | Change password |

### Products

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/products` | GET | Get all products (with filters) |
| `/api/products/:id` | GET | Get product by ID |
| `/api/products/featured` | GET | Get featured products |
| `/api/products/new-arrivals` | GET | Get new products |
| `/api/products/best-selling` | GET | Get best sellers |
| `/api/products/search` | GET | Search products |

### Categories

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/categories` | GET | Get all categories |
| `/api/categories/:slug` | GET | Get category by slug |
| `/api/categories/:slug/products` | GET | Get products in category |

### User (Authenticated)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/user/me` | GET | Get current user profile |
| `/api/user/me` | PUT | Update user profile |
| `/api/user/addresses` | GET | Get user addresses |
| `/api/user/addresses` | POST | Add new address |

### Cart (Authenticated)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/cart` | GET | Get user's cart |
| `/api/cart` | POST | Add item to cart |
| `/api/cart/:itemId` | PUT | Update cart item |
| `/api/cart/:itemId` | DELETE | Remove from cart |

### Orders (Authenticated)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/orders` | GET | Get user's orders |
| `/api/orders/:id` | GET | Get order details |
| `/api/orders` | POST | Create new order |
| `/api/orders/:id/cancel` | POST | Cancel order |

### Admin Endpoints (Admin Role Required)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/dashboard/stats` | GET | Get dashboard statistics |
| `/api/admin/products` | POST | Create product |
| `/api/admin/products/:id` | PUT | Update product |
| `/api/admin/products/:id` | DELETE | Delete product |
| `/api/admin/users` | GET | Get all users |
| `/api/admin/users/:id/role` | PUT | Update user role |
| `/api/admin/users/:id/password` | PUT | Reset user password |
| `/api/admin/orders` | GET | Get all orders |
| `/api/admin/orders/:id/status` | PUT | Update order status |

---

## 👨‍💼 Admin Panel

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

### User Roles & Permissions

| Role | Permissions |
|------|-------------|
| super_admin | Full access to everything |
| admin | Manage products, orders, users (not other admins) |
| moderator | Edit products, view/update orders, view users |
| editor | Create/edit products, view categories |
| viewer | Read-only access |
| customer | No admin access |

---

## 🚀 Deployment

### Frontend (Vercel)

The frontend is configured for Vercel deployment:

1. Connect your GitHub repository to Vercel
2. Set the root directory to `Agora-ecommerce-catalog/frontend`
3. Add environment variable: `VITE_API_URL=https://your-backend-url.com/api`
4. Deploy

### Backend (Render)

The backend can be deployed to Render:

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set root directory to `Agora-ecommerce-catalog/backend`
4. Build command: `npm install && npm run build`
5. Start command: `npm start`
6. Add environment variables (database, JWT secrets, etc.)

---

## 💻 Development

### Available Scripts

#### Frontend (from `frontend/` directory)

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
npm run test      # Run tests
```

#### Backend (from `backend/` directory)

```bash
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

---

## 🔧 Troubleshooting

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
- Check `FRONTEND_URL` in backend `.env`

#### "422 Unprocessable Entity" on product creation

- Ensure all required fields are filled
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

## 📄 License

This project is for educational purposes as part of the ALX program.

---

## 👥 Contributors

- Built with ❤️ for the ALX Frontend Project

---

Made with React, Node.js, and TypeScript 🚀
