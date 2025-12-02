# PlanetScale Database Setup Guide

This guide walks you through setting up a PlanetScale database for the AGORA E-Commerce platform.

## Step 1: Create a PlanetScale Account

1. Go to [planetscale.com](https://planetscale.com)
2. Click "Get Started" and create a free account
3. Verify your email address

## Step 2: Create a New Database

1. From the PlanetScale dashboard, click "Create database"
2. Name your database: `agora_ecommerce`
3. Select a region closest to your users (e.g., `us-east-1`)
4. Click "Create database"

## Step 3: Get Connection Credentials

1. Navigate to your database in the dashboard
2. Click "Connect" button
3. Select "Connect with: Node.js"
4. Copy the connection details:
   - Host (e.g., `aws.connect.psdb.cloud`)
   - Username
   - Password

**Important**: Save these credentials securely - you'll need them for Vercel environment variables.

## Step 4: Run Database Migrations

### Option A: Using PlanetScale Console

1. In your PlanetScale dashboard, go to "Console"
2. Copy the contents of each migration file and run them in order:
   - `backend/migrations/001_initial_schema.sql`
   - `backend/migrations/002_add_user_roles.sql`
   - `backend/migrations/003_fix_thumbnail_column.sql`

### Option B: Using Local Connection

1. Create a `.env` file in the `backend` folder with PlanetScale credentials:

```env
DB_HOST=your-host.connect.psdb.cloud
DB_PORT=3306
DB_NAME=agora_ecommerce
DB_USER=your-username
DB_PASSWORD=your-password
```

2. Run migrations:

```bash
cd Agora-ecommerce-catalog/backend
npm run migrate
```

## Step 5: Seed Initial Data (Optional)

After migrations, you can seed the database with sample data:

```bash
cd Agora-ecommerce-catalog/backend
npm run seed
```

## Connection String Format

PlanetScale provides a connection string in this format:

```
mysql://username:password@host/database?ssl={"rejectUnauthorized":true}
```

## Environment Variables for Vercel

Add these to your Vercel project settings:

| Variable | Example Value |
|----------|---------------|
| `DB_HOST` | `aws.connect.psdb.cloud` |
| `DB_PORT` | `3306` |
| `DB_NAME` | `agora_ecommerce` |
| `DB_USER` | `your-username` |
| `DB_PASSWORD` | `your-password` |

## Troubleshooting

### Connection Timeout
- Ensure SSL is enabled in your database configuration
- Check that the IP isn't being blocked

### Authentication Failed
- Double-check your credentials in Vercel environment variables
- Regenerate the password in PlanetScale if needed

### Database Not Found
- Verify the database name matches exactly
- Ensure you're connecting to the correct region

## Resources

- [PlanetScale Documentation](https://docs.planetscale.com/)
- [PlanetScale + Vercel Guide](https://docs.planetscale.com/docs/tutorials/deploy-to-vercel)




