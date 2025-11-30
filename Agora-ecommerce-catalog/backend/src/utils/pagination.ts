import { PaginationParams } from '../types';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 100;

// Parse pagination from query params
export const parsePagination = (query: {
  page?: string;
  limit?: string;
}): PaginationParams => {
  let page = parseInt(query.page || String(DEFAULT_PAGE), 10);
  let limit = parseInt(query.limit || String(DEFAULT_LIMIT), 10);

  // Validate page
  if (isNaN(page) || page < 1) {
    page = DEFAULT_PAGE;
  }

  // Validate limit
  if (isNaN(limit) || limit < 1) {
    limit = DEFAULT_LIMIT;
  } else if (limit > MAX_LIMIT) {
    limit = MAX_LIMIT;
  }

  return { page, limit };
};

// Calculate offset for SQL queries
export const calculateOffset = (page: number, limit: number): number => {
  return (page - 1) * limit;
};

// Build pagination SQL clause
export const buildPaginationClause = (
  page: number,
  limit: number
): string => {
  const offset = calculateOffset(page, limit);
  return `LIMIT ${limit} OFFSET ${offset}`;
};

// Calculate pagination metadata
export const calculatePaginationMeta = (
  page: number,
  limit: number,
  total: number
): {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
} => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

