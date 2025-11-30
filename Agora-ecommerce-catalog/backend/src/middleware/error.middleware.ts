import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

// Custom error class
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Not found error handler
export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
  });
};

// Global error handler
export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Default error values
  let statusCode = 500;
  let message = 'Internal Server Error';

  // Handle AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Handle validation errors from express-validator
  if (err.name === 'ValidationError') {
    statusCode = 422;
    message = err.message;
  }

  // Handle MySQL errors
  if ('code' in err) {
    const sqlError = err as { code: string; sqlMessage?: string };
    
    if (sqlError.code === 'ER_DUP_ENTRY') {
      statusCode = 409;
      message = 'Duplicate entry';
    }
    
    if (sqlError.code === 'ER_NO_REFERENCED_ROW_2') {
      statusCode = 400;
      message = 'Referenced record not found';
    }
  }

  // Log error in development
  if (env.isDevelopment) {
    console.error('Error:', err);
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(env.isDevelopment && { stack: err.stack }),
  });
};

// Async handler wrapper
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

