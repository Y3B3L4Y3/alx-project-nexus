# Quick Start Guide

Get AGORA running in 5 minutes!

---

## Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [MySQL](https://www.mysql.com/) (version 8.0 or higher)
- A code editor (VS Code recommended)

---

## Step 1: Download the Project

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project folder
cd Agora-ecommerce-catalog
```

---

## Step 2: Setup the Database

### Create MySQL Database

Open MySQL command line or a tool like MySQL Workbench:

```sql
CREATE DATABASE agora_ecommerce;
```

---

## Step 3: Configure Backend

```bash
# Go to backend folder
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env    # If .env.example exists
# OR create manually:
nano .env
```

Add this to your `.env` file:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=agora_ecommerce

JWT_SECRET=my-super-secret-key-change-this
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=my-refresh-secret-key-change-this
JWT_REFRESH_EXPIRES_IN=7d
```

### Run Database Migrations

```bash
npm run migrate
```

### (Optional) Add Sample Data

```bash
npm run seed
```

---

## Step 4: Start the Backend

```bash
# Still in backend folder
npm run dev
```

You should see:

```
Server running on http://localhost:5000
Connected to MySQL database
```

**Keep this terminal open!**

---

## Step 5: Setup Frontend

Open a **new terminal**:

```bash
# Go to main project folder
cd Agora-ecommerce-catalog

# Install dependencies
npm install

# Start development server
npm run dev
```

You should see:

```
VITE v5.x.x ready in xxx ms

➜  Local:   http://localhost:5173/
```

---

## Step 6: Open the Application

Open your browser and go to:

**Customer Store:** http://localhost:5173

**Admin Panel:** http://localhost:5173/admin/login

---

## Default Login Credentials

If you ran the seed command, you can use these accounts:

| Role | Email | Password |
|------|-------|----------|
| Super Admin | superadmin@agora.com | SuperAdmin@123 |
| Admin | admin@agora.com | Admin@123 |
| Moderator | moderator@agora.com | Moderator@123 |
| Editor | editor@agora.com | Editor@123 |
| Viewer | viewer@agora.com | Viewer@123 |
| Customer | customer@example.com | Customer@123 |

---

## Quick Commands Reference

| Command | Location | Description |
|---------|----------|-------------|
| `npm run dev` | Frontend folder | Start frontend dev server |
| `npm run dev` | Backend folder | Start backend dev server |
| `npm run build` | Frontend folder | Build for production |
| `npm run migrate` | Backend folder | Run database migrations |
| `npm run seed` | Backend folder | Add sample data |

---

## Project URLs

| URL | Description |
|-----|-------------|
| http://localhost:5173 | Frontend (customer site) |
| http://localhost:5173/admin | Admin panel |
| http://localhost:5000/api | Backend API |

---

## Common Issues

### "Cannot connect to database"

1. Make sure MySQL is running
2. Check your password in `.env`
3. Make sure the database exists

### "Port already in use"

Backend port 5000 is busy:
```bash
# Find and kill the process
lsof -i :5000
kill -9 <PID>
```

Frontend port 5173 is busy:
```bash
# Vite will automatically try the next port
# Or kill the process:
lsof -i :5173
kill -9 <PID>
```

### "Module not found"

```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

---

## Next Steps

1. **Explore the store** - Browse products, add to cart
2. **Try the admin panel** - Manage products and orders
3. **Read full documentation** - See [README.md](../README.md)
4. **Customize** - Modify styles, add features

---

## Need Help?

- Check the full [README.md](../README.md)
- Review the [API Reference](./API_REFERENCE.md)
- Look at the [Database Schema](./DATABASE.md)

---

Happy coding! 🚀

