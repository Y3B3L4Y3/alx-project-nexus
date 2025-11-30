import { body, param } from 'express-validator';

export const createOrderValidator = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  
  body('items.*.productId')
    .isInt({ min: 1 })
    .withMessage('Valid product ID is required for each item'),
  
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  
  body('items.*.selectedColor')
    .optional()
    .isString()
    .withMessage('Selected color must be a string'),
  
  body('items.*.selectedSize')
    .optional()
    .isString()
    .withMessage('Selected size must be a string'),
  
  body('shippingAddressId')
    .isInt({ min: 1 })
    .withMessage('Valid shipping address ID is required'),
  
  body('billingAddressId')
    .isInt({ min: 1 })
    .withMessage('Valid billing address ID is required'),
  
  body('paymentMethodId')
    .isInt({ min: 1 })
    .withMessage('Valid payment method ID is required'),
  
  body('couponCode')
    .optional()
    .isString()
    .withMessage('Coupon code must be a string'),
];

export const updateOrderStatusValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Valid order ID is required'),
  
  body('status')
    .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid order status'),
];

export const updateTrackingValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Valid order ID is required'),
  
  body('trackingNumber')
    .trim()
    .notEmpty()
    .withMessage('Tracking number is required'),
  
  body('estimatedDelivery')
    .optional()
    .isISO8601()
    .withMessage('Invalid delivery date format'),
];

export const addressValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name must be less than 100 characters'),
  
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone is required')
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),
  
  body('street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required')
    .isLength({ max: 255 })
    .withMessage('Street address must be less than 255 characters'),
  
  body('apartment')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Apartment must be less than 100 characters'),
  
  body('city')
    .trim()
    .notEmpty()
    .withMessage('City is required')
    .isLength({ max: 100 })
    .withMessage('City must be less than 100 characters'),
  
  body('state')
    .trim()
    .notEmpty()
    .withMessage('State is required')
    .isLength({ max: 100 })
    .withMessage('State must be less than 100 characters'),
  
  body('country')
    .trim()
    .notEmpty()
    .withMessage('Country is required')
    .isLength({ max: 100 })
    .withMessage('Country must be less than 100 characters'),
  
  body('zipCode')
    .trim()
    .notEmpty()
    .withMessage('ZIP code is required')
    .isLength({ max: 20 })
    .withMessage('ZIP code must be less than 20 characters'),
  
  body('isDefault')
    .optional()
    .isBoolean()
    .withMessage('isDefault must be a boolean'),
];

export const reviewValidator = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Review title is required')
    .isLength({ max: 255 })
    .withMessage('Title must be less than 255 characters'),
  
  body('comment')
    .trim()
    .notEmpty()
    .withMessage('Review comment is required'),
];

export const contactValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name must be less than 100 characters'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('phone')
    .optional()
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),
  
  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject is required')
    .isLength({ max: 255 })
    .withMessage('Subject must be less than 255 characters'),
  
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required'),
];

