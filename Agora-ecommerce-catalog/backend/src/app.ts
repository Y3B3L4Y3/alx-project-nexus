import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { env } from './config/env';
import { corsOptions } from './config/cors';
import { testConnection } from './config/database';
import { apiLimiter } from './middleware/rateLimit.middleware';
import { notFoundHandler, errorHandler } from './middleware/error.middleware';
import routes from './routes';

// Create Express app
const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(cors(corsOptions));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rate limiting
app.use('/api', apiLimiter);

// API routes
app.use('/api', routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server (only in local development, not in serverless)
const startServer = async () => {
  // Test database connection
  const dbConnected = await testConnection();
  
  if (!dbConnected && env.isProduction) {
    console.error('Failed to connect to database. Exiting...');
    process.exit(1);
  }

  app.listen(env.port, () => {
    console.log(`
╔════════════════════════════════════════════════════╗
║     AGORA E-Commerce Backend API                   ║
╠════════════════════════════════════════════════════╣
║  Environment: ${env.nodeEnv.padEnd(36)}║
║  Port: ${String(env.port).padEnd(43)}║
║  Database: ${env.db.name.padEnd(39)}║
╚════════════════════════════════════════════════════╝
    `);
  });
};

// Only start the server when running locally (not on Vercel serverless)
if (!process.env.VERCEL) {
  startServer();
}

export default app;

