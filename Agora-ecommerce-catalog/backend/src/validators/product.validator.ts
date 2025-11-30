import { body, query, param } from 'express-validator';

export const createProductValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ max: 255 })
    .withMessage('Product name must be less than 255 characters'),
  
  body('description')
    .optional()
    .trim(),
  
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('originalPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Original price must be a positive number'),
  
  body('discount')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Discount must be between 0 and 100'),
  
  body('thumbnail')
    .trim()
    .notEmpty()
    .withMessage('Thumbnail is required')
    .custom((value) => {
      // Allow data URLs (base64), relative paths, or valid URLs
      if (value.startsWith('data:image/')) return true;
      if (value.startsWith('/')) return true;
      if (value.startsWith('http://') || value.startsWith('https://')) {
        return /^https?:\/\/.+/.test(value);
      }
      return false;
    })
    .withMessage('Thumbnail must be a valid URL, data URL, or path'),
  
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  
  body('categoryId')
    .isInt({ min: 1 })
    .withMessage('Valid category ID is required'),
  
  body('brand')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Brand must be less than 100 characters'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('colors')
    .optional()
    .isArray()
    .withMessage('Colors must be an array'),
  
  body('sizes')
    .optional()
    .isArray()
    .withMessage('Sizes must be an array'),
  
  body('isNew')
    .optional()
    .isBoolean()
    .withMessage('isNew must be a boolean'),
  
  body('isFeatured')
    .optional()
    .isBoolean()
    .withMessage('isFeatured must be a boolean'),
  
  body('status')
    .optional()
    .isIn(['active', 'draft', 'deleted'])
    .withMessage('Status must be active, draft, or deleted'),
];

export const updateProductValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Valid product ID is required'),
  
  body('name')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Product name must be less than 255 characters'),
  
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
];

export const productQueryValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a positive number'),
  
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a positive number'),
  
  query('rating')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Rating must be between 0 and 5'),
  
  query('sortBy')
    .optional()
    .isIn(['price-asc', 'price-desc', 'rating', 'newest', 'popular'])
    .withMessage('Invalid sort option'),
];

