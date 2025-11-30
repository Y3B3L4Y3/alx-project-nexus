# Deployment Guide

This guide covers deploying the AGORA e-commerce platform to production.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Frontend Deployment](#frontend-deployment)
- [Backend Deployment](#backend-deployment)
- [Database Setup](#database-setup)
- [Environment Configuration](#environment-configuration)
- [Nginx Configuration](#nginx-configuration)
- [SSL Certificates](#ssl-certificates)
- [PM2 Process Manager](#pm2-process-manager)
- [Docker Deployment](#docker-deployment)

---

## Prerequisites

### Server Requirements

- Ubuntu 20.04+ or similar Linux distribution
- 2GB RAM minimum (4GB recommended)
- 20GB disk space
- Node.js 18+
- MySQL 8.0+
- Nginx (for reverse proxy)

### Domain Setup

1. Point your domain to your server's IP address
2. Configure DNS A records:
   - `yourdomain.com` → Server IP
   - `api.yourdomain.com` → Server IP (optional, for API subdomain)

---

## Frontend Deployment

### Option 1: Static Hosting (Recommended)

Build the frontend and deploy to a static hosting service.

#### Build the Project

```bash
cd Agora-ecommerce-catalog

# Install dependencies
npm install

# Create production build
npm run build
```

This creates a `dist/` folder with optimized static files.

#### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

#### Deploy to Your Server

```bash
# Copy dist folder to server
scp -r dist/* user@server:/var/www/agora/

# On server, configure Nginx (see Nginx section)
```

---

### Option 2: Node.js Server

Serve the built files using a Node.js server.

```bash
# Install serve globally
npm install -g serve

# Serve the dist folder
serve -s dist -l 3000
```

---

## Backend Deployment

### 1. Prepare the Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MySQL
sudo apt install -y mysql-server

# Install PM2 (process manager)
sudo npm install -g pm2
```

### 2. Clone and Setup

```bash
# Create app directory
sudo mkdir -p /var/www/agora-api
sudo chown $USER:$USER /var/www/agora-api

# Clone repository (or upload files)
cd /var/www/agora-api
git clone <repository-url> .

# Go to backend
cd backend

# Install dependencies
npm install --production

# Build TypeScript
npm run build
```

### 3. Environment Configuration

```bash
# Create production .env file
nano .env
```

Add production environment variables (see Environment Configuration section).

### 4. Database Setup

```bash
# Run migrations
npm run migrate

# Seed initial data (optional)
npm run seed
```

### 5. Create Uploads Directory

```bash
mkdir -p uploads
chmod 755 uploads
```

### 6. Start with PM2

```bash
# Start the application
pm2 start dist/app.js --name "agora-api"

# Save PM2 configuration
pm2 save

# Setup auto-start on reboot
pm2 startup
```

---

## Database Setup

### MySQL Configuration

```bash
# Secure MySQL installation
sudo mysql_secure_installation

# Login to MySQL
sudo mysql -u root -p
```

```sql
-- Create database
CREATE DATABASE agora_ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user
CREATE USER 'agora_user'@'localhost' IDENTIFIED BY 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON agora_ecommerce.* TO 'agora_user'@'localhost';
FLUSH PRIVILEGES;

EXIT;
```

### Run Migrations

```bash
cd /var/www/agora-api/backend
npm run migrate
```

### Create Admin User

```bash
# Connect to MySQL
mysql -u agora_user -p agora_ecommerce

# Insert admin user (password: Admin123!)
INSERT INTO users (email, password_hash, first_name, last_name, role, status)
VALUES (
  'admin@yourdomain.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.XqJ8aNdj5UYXQC',
  'Admin',
  'User',
  'admin',
  'active'
);
```

---

## Environment Configuration

### Production Backend .env

```env
# Server
PORT=5000
NODE_ENV=production

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=agora_user
DB_PASSWORD=your_secure_database_password
DB_NAME=agora_ecommerce

# JWT (generate secure keys!)
JWT_SECRET=generate_a_very_long_random_string_here_at_least_64_chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=another_very_long_random_string_different_from_above
JWT_REFRESH_EXPIRES_IN=7d

# Frontend URL (for CORS)
FRONTEND_URL=https://yourdomain.com

# Optional: AWS S3 for image storage
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_BUCKET_NAME=your-bucket-name
AWS_REGION=us-east-1

# Optional: Email service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### Frontend Environment

Create `.env.production`:

```env
VITE_API_URL=https://api.yourdomain.com/api
```

Or if using same domain:

```env
VITE_API_URL=/api
```

### Generate Secure JWT Secrets

```bash
# Generate random strings for JWT secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Nginx Configuration

### Install Nginx

```bash
sudo apt install -y nginx
```

### Frontend Configuration

Create `/etc/nginx/sites-available/agora`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/agora;
    index index.html;

    # Handle SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # API proxy (if backend on same server)
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Uploads proxy
    location /uploads {
        proxy_pass http://localhost:5000;
    }
}
```

### Backend-Only Configuration (if using subdomain)

Create `/etc/nginx/sites-available/agora-api`:

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Increase body size for file uploads
        client_max_body_size 10M;
    }
}
```

### Enable Sites

```bash
# Enable sites
sudo ln -s /etc/nginx/sites-available/agora /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/agora-api /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## SSL Certificates

### Using Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain certificates
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
sudo certbot --nginx -d api.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

Certbot automatically updates your Nginx configuration to use HTTPS.

---

## PM2 Process Manager

### Useful Commands

```bash
# View running processes
pm2 list

# View logs
pm2 logs agora-api

# Monitor resources
pm2 monit

# Restart application
pm2 restart agora-api

# Stop application
pm2 stop agora-api

# Delete from PM2
pm2 delete agora-api
```

### PM2 Ecosystem File

Create `ecosystem.config.js` in backend folder:

```javascript
module.exports = {
  apps: [{
    name: 'agora-api',
    script: 'dist/app.js',
    instances: 'max',
    exec_mode: 'cluster',
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/error.log',
    out_file: './logs/output.log',
    merge_logs: true,
    time: true
  }]
};
```

Start with:

```bash
pm2 start ecosystem.config.js --env production
```

---

## Docker Deployment

### Dockerfile (Backend)

Create `backend/Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["node", "dist/app.js"]
```

### Dockerfile (Frontend)

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "80:80"
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DB_HOST=mysql
      - DB_PORT=3306
      - DB_USER=agora_user
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_NAME=agora_ecommerce
      - JWT_SECRET=${JWT_SECRET}
      - JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
    depends_on:
      - mysql
    volumes:
      - uploads:/app/uploads

  mysql:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
      - MYSQL_DATABASE=agora_ecommerce
      - MYSQL_USER=agora_user
      - MYSQL_PASSWORD=${DB_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"

volumes:
  mysql_data:
  uploads:
```

### Deploy with Docker

```bash
# Build and start containers
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

---

## Health Checks

### Backend Health Endpoint

Add to your API (if not already present):

```typescript
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

### Monitor with PM2

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
```

---

## Backup Strategy

### Database Backup

```bash
# Create backup script
cat > /home/user/backup-db.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/user/backups"
mkdir -p $BACKUP_DIR
mysqldump -u agora_user -p agora_ecommerce > $BACKUP_DIR/agora_$DATE.sql
gzip $BACKUP_DIR/agora_$DATE.sql
# Keep only last 7 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete
EOF

chmod +x /home/user/backup-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add: 0 2 * * * /home/user/backup-db.sh
```

### Uploads Backup

```bash
# Backup uploads folder
rsync -avz /var/www/agora-api/backend/uploads/ /home/user/backups/uploads/
```

---

## Troubleshooting

### Application Won't Start

```bash
# Check PM2 logs
pm2 logs agora-api --lines 100

# Check if port is in use
sudo lsof -i :5000

# Check environment variables
pm2 env 0
```

### Database Connection Issues

```bash
# Test MySQL connection
mysql -u agora_user -p agora_ecommerce -e "SELECT 1"

# Check MySQL status
sudo systemctl status mysql
```

### Nginx Issues

```bash
# Check Nginx config
sudo nginx -t

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
```

### SSL Certificate Issues

```bash
# Renew certificates manually
sudo certbot renew

# Check certificate status
sudo certbot certificates
```

