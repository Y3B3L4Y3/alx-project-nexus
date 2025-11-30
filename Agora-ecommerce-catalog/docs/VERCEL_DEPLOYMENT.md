# Vercel Deployment Guide

Complete guide for deploying the AGORA E-Commerce platform to Vercel.

## Prerequisites

- A [Vercel account](https://vercel.com)
- A [PlanetScale account](https://planetscale.com) (for MySQL database)
- Your code pushed to GitHub, GitLab, or Bitbucket

## Step 1: Set Up PlanetScale Database

See [PLANETSCALE_SETUP.md](./PLANETSCALE_SETUP.md) for detailed instructions.

## Step 2: Connect Repository to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your repository containing this project
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `Agora-ecommerce-catalog`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install && cd backend && npm install`

## Step 3: Configure Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables, add:

### Required Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Sets production mode |
| `DB_HOST` | `your-host.connect.psdb.cloud` | PlanetScale host |
| `DB_PORT` | `3306` | Database port |
| `DB_NAME` | `agora_ecommerce` | Database name |
| `DB_USER` | `your-username` | PlanetScale username |
| `DB_PASSWORD` | `your-password` | PlanetScale password |
| `JWT_ACCESS_SECRET` | `(generate)` | JWT signing secret |
| `JWT_REFRESH_SECRET` | `(generate)` | Refresh token secret |
| `FRONTEND_URL` | `https://your-app.vercel.app` | Your Vercel URL |

### Optional Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `JWT_ACCESS_EXPIRY` | `15m` | Access token expiry |
| `JWT_REFRESH_EXPIRY` | `7d` | Refresh token expiry |
| `AWS_ACCESS_KEY_ID` | | For S3 uploads |
| `AWS_SECRET_ACCESS_KEY` | | For S3 uploads |
| `AWS_BUCKET_NAME` | | S3 bucket name |
| `AWS_REGION` | | AWS region |
| `SMTP_HOST` | | Email service host |
| `SMTP_PORT` | `587` | Email service port |
| `SMTP_USER` | | Email username |
| `SMTP_PASS` | | Email password |

### Generating Secure Secrets

Use these commands to generate secure JWT secrets:

```bash
# On Linux/macOS
openssl rand -base64 32

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Step 4: Deploy

1. Click "Deploy" in Vercel dashboard
2. Wait for the build to complete
3. Once deployed, update `FRONTEND_URL` with your actual Vercel URL

## Step 5: Run Database Migrations

After deployment, run migrations against PlanetScale:

### Option A: Via PlanetScale Console
1. Go to PlanetScale dashboard → Your database → Console
2. Run each migration SQL file manually

### Option B: Via Local Connection
```bash
# Set PlanetScale credentials in local .env
cd Agora-ecommerce-catalog/backend
npm run migrate
npm run seed  # Optional: seed sample data
```

## Local Development Setup

For local development, create a `.env.local` file in `Agora-ecommerce-catalog/`:

```env
VITE_API_URL=http://localhost:5000/api
```

And in `Agora-ecommerce-catalog/backend/.env`:

```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=agora_ecommerce
DB_USER=root
DB_PASSWORD=your-local-password
JWT_ACCESS_SECRET=dev-secret-key
JWT_REFRESH_SECRET=dev-refresh-secret
FRONTEND_URL=http://localhost:5173
```

## Project Structure for Vercel

```
Agora-ecommerce-catalog/
├── api/
│   └── index.ts          # Serverless function entry point
├── backend/
│   └── src/
│       └── app.ts        # Express app (exported for serverless)
├── dist/                 # Frontend build output
├── src/                  # Frontend source
├── vercel.json           # Vercel configuration
└── package.json
```

## Troubleshooting

### Build Fails
- Check that both frontend and backend dependencies install correctly
- Verify TypeScript compilation has no errors

### API Returns 500 Error
- Check Vercel function logs for errors
- Verify database connection credentials
- Ensure PlanetScale database is accessible

### CORS Errors
- Verify `FRONTEND_URL` is set correctly
- Check that it matches your actual Vercel domain

### Database Connection Fails
- Confirm PlanetScale credentials are correct
- Check that SSL is enabled in database config
- Verify the database exists and migrations ran

### Authentication Issues
- Ensure JWT secrets are set and consistent
- Check token expiry settings

## Useful Commands

```bash
# View Vercel logs
vercel logs

# Redeploy
vercel --prod

# List environment variables
vercel env ls
```

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [PlanetScale Documentation](https://docs.planetscale.com/)
- [Express on Vercel](https://vercel.com/guides/using-express-with-vercel)

