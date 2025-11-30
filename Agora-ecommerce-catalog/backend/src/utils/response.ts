import { Response } from 'express';
import { ApiResponse, PaginatedResponse, ValidationError } from '../types';

// Success response
export const sendSuccess = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
  };
  return res.status(statusCode).json(response);
};

// Created response (201)
export const sendCreated = <T>(
  res: Response,
  data: T,
  message?: string
): Response => {
  return sendSuccess(res, data, message, 201);
};

// Paginated response
export const sendPaginated = <T>(
  res: Response,
  data: T[],
  pagination: {
    page: number;
    limit: number;
    total: number;
  }
): Response => {
  const totalPages = Math.ceil(pagination.total / pagination.limit);
  
  const response: PaginatedResponse<T> = {
    success: true,
    data,
    pagination: {
      ...pagination,
      totalPages,
    },
  };
  
  // Set headers for pagination info
  res.setHeader('X-Total-Count', pagination.total.toString());
  res.setHeader('X-Total-Pages', totalPages.toString());
  
  return res.status(200).json(response);
};

// Error response
export const sendError = (
  res: Response,
  error: string,
  statusCode: number = 400
): Response => {
  const response: ApiResponse<null> = {
    success: false,
    error,
  };
  return res.status(statusCode).json(response);
};

// Validation error response
export const sendValidationError = (
  res: Response,
  errors: ValidationError[]
): Response => {
  const response: ApiResponse<null> = {
    success: false,
    error: 'Validation failed',
    errors,
  };
  return res.status(422).json(response);
};

// Not found response
export const sendNotFound = (
  res: Response,
  resource: string = 'Resource'
): Response => {
  return sendError(res, `${resource} not found`, 404);
};

// Unauthorized response
export const sendUnauthorized = (
  res: Response,
  message: string = 'Unauthorized'
): Response => {
  return sendError(res, message, 401);
};

// Forbidden response
export const sendForbidden = (
  res: Response,
  message: string = 'Forbidden'
): Response => {
  return sendError(res, message, 403);
};

// Internal server error
export const sendServerError = (
  res: Response,
  error?: Error
): Response => {
  console.error('Server error:', error);
  return sendError(res, 'Internal server error', 500);
};

