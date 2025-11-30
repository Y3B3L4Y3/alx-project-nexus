import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate, adminOnly } from '../middleware/auth.middleware';
import DashboardController from '../controllers/admin/dashboard.controller';
import UsersController from '../controllers/admin/users.controller';
import SettingsController from '../controllers/admin/settings.controller';
import ProductModel from '../models/product.model';
import CategoryModel from '../models/category.model';
import OrderModel from '../models/order.model';
import UserModel from '../models/user.model';
import TokenModel from '../models/token.model';
import { sendSuccess, sendCreated, sendPaginated, sendNotFound, sendError } from '../utils/response';
import { asyncHandler } from '../middleware/error.middleware';
import { parsePagination } from '../utils/pagination';
import { validate } from '../middleware/validate.middleware';
import { createProductValidator, updateProductValidator } from '../validators/product.validator';
import { updateOrderStatusValidator, updateTrackingValidator } from '../validators/order.validator';
import { hashPassword } from '../utils/password';
import { uploadLocal } from '../services/upload.service';
import { query } from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(adminOnly);

// Dashboard
router.get('/dashboard/stats', DashboardController.getStats);
router.get('/dashboard/sales', DashboardController.getSales);
router.get('/dashboard/orders-chart', DashboardController.getOrdersChart);

// Products Management
router.post('/products', validate(createProductValidator), asyncHandler(async (req, res) => {
  const productData = req.body;
  const productId = await ProductModel.create({
    name: productData.name,
    description: productData.description,
    price: productData.price,
    original_price: productData.originalPrice,
    discount: productData.discount,
    thumbnail: productData.thumbnail,
    stock: productData.stock,
    category_id: productData.categoryId,
    brand: productData.brand,
    tags: productData.tags,
    colors: productData.colors,
    sizes: productData.sizes,
    is_new: productData.isNew,
    is_featured: productData.isFeatured,
    status: productData.status || 'active',  // Added missing status field
  });
  
  const product = await ProductModel.findById(productId);
  sendCreated(res, product, 'Product created successfully');
}));

router.put('/products/:id', validate(updateProductValidator), asyncHandler(async (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const productData = req.body;
  
  // Map camelCase to snake_case for the model
  const mappedData: Record<string, any> = {};
  
  if (productData.name !== undefined) mappedData.name = productData.name;
  if (productData.description !== undefined) mappedData.description = productData.description;
  if (productData.price !== undefined) mappedData.price = productData.price;
  if (productData.originalPrice !== undefined) mappedData.original_price = productData.originalPrice;
  if (productData.discount !== undefined) mappedData.discount = productData.discount;
  if (productData.thumbnail !== undefined) mappedData.thumbnail = productData.thumbnail;
  if (productData.stock !== undefined) mappedData.stock = productData.stock;
  if (productData.categoryId !== undefined) mappedData.category_id = productData.categoryId;
  if (productData.brand !== undefined) mappedData.brand = productData.brand;
  if (productData.tags !== undefined) mappedData.tags = productData.tags;
  if (productData.colors !== undefined) mappedData.colors = productData.colors;
  if (productData.sizes !== undefined) mappedData.sizes = productData.sizes;
  if (productData.isNew !== undefined) mappedData.is_new = productData.isNew;
  if (productData.isFeatured !== undefined) mappedData.is_featured = productData.isFeatured;
  if (productData.status !== undefined) mappedData.status = productData.status;
  
  const updated = await ProductModel.update(productId, mappedData);
  
  if (!updated) {
    return sendNotFound(res, 'Product');
  }
  
  const product = await ProductModel.findById(productId);
  sendSuccess(res, product, 'Product updated successfully');
}));

router.delete('/products/:id', asyncHandler(async (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const deleted = await ProductModel.softDelete(productId);
  
  if (!deleted) {
    return sendNotFound(res, 'Product');
  }
  
  sendSuccess(res, null, 'Product deleted successfully');
}));

// Product Images Management
router.get('/products/:id/images', asyncHandler(async (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const product = await ProductModel.findById(productId);
  
  if (!product) {
    return sendNotFound(res, 'Product');
  }
  
  const images = await ProductModel.getImages(productId);
  sendSuccess(res, images);
}));

router.post('/products/:id/images', uploadLocal.array('images', 10), asyncHandler(async (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const product = await ProductModel.findById(productId);
  
  if (!product) {
    return sendNotFound(res, 'Product');
  }
  
  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    return sendError(res, 'No images uploaded', 400);
  }
  
  // Add images to database
  const imageUrls: string[] = [];
  for (let i = 0; i < req.files.length; i++) {
    const file = req.files[i] as Express.Multer.File;
    const imageUrl = `/uploads/${file.filename}`;
    await ProductModel.addImage(productId, imageUrl, i);
    imageUrls.push(imageUrl);
  }
  
  sendCreated(res, { imageUrls }, 'Images uploaded successfully');
}));

router.delete('/products/:productId/images/:imageId', asyncHandler(async (req, res) => {
  const imageId = parseInt(req.params.imageId, 10);
  const deleted = await ProductModel.deleteImage(imageId);
  
  if (!deleted) {
    return sendNotFound(res, 'Image');
  }
  
  sendSuccess(res, null, 'Image deleted successfully');
}));

// Categories Management
router.post('/categories', asyncHandler(async (req, res) => {
  const { name, slug, icon, image, parentId } = req.body;
  
  if (await CategoryModel.slugExists(slug)) {
    return sendError(res, 'Category slug already exists', 400);
  }
  
  const categoryId = await CategoryModel.create({
    name,
    slug,
    icon,
    image,
    parent_id: parentId,
  });
  
  const category = await CategoryModel.findById(categoryId);
  sendCreated(res, category, 'Category created successfully');
}));

router.put('/categories/:id', asyncHandler(async (req, res) => {
  const categoryId = parseInt(req.params.id, 10);
  const { name, slug, icon, image, parentId } = req.body;
  
  if (slug && await CategoryModel.slugExists(slug, categoryId)) {
    return sendError(res, 'Category slug already exists', 400);
  }
  
  const updated = await CategoryModel.update(categoryId, {
    name,
    slug,
    icon,
    image,
    parent_id: parentId,
  });
  
  if (!updated) {
    return sendNotFound(res, 'Category');
  }
  
  const category = await CategoryModel.findById(categoryId);
  sendSuccess(res, category, 'Category updated successfully');
}));

router.delete('/categories/:id', asyncHandler(async (req, res) => {
  const categoryId = parseInt(req.params.id, 10);
  const deleted = await CategoryModel.remove(categoryId);
  
  if (!deleted) {
    return sendNotFound(res, 'Category');
  }
  
  sendSuccess(res, null, 'Category deleted successfully');
}));

// Orders Management
router.get('/orders', asyncHandler(async (req, res) => {
  const { page, limit } = parsePagination(req.query as { page?: string; limit?: string });
  const status = req.query.status as string | undefined;
  
  const { orders, total } = await OrderModel.findAll(page, limit, status as any);
  sendPaginated(res, orders, { page, limit, total });
}));

router.put('/orders/:id/status', validate(updateOrderStatusValidator), asyncHandler(async (req, res) => {
  const orderId = parseInt(req.params.id, 10);
  const { status } = req.body;
  
  const updated = await OrderModel.updateStatus(orderId, status);
  if (!updated) {
    return sendNotFound(res, 'Order');
  }
  
  const order = await OrderModel.findById(orderId);
  sendSuccess(res, order, 'Order status updated');
}));

router.put('/orders/:id/tracking', validate(updateTrackingValidator), asyncHandler(async (req, res) => {
  const orderId = parseInt(req.params.id, 10);
  const { trackingNumber, estimatedDelivery } = req.body;
  
  const updated = await OrderModel.updateTracking(orderId, trackingNumber, estimatedDelivery ? new Date(estimatedDelivery) : undefined);
  if (!updated) {
    return sendNotFound(res, 'Order');
  }
  
  const order = await OrderModel.findById(orderId);
  sendSuccess(res, order, 'Tracking updated');
}));

// Users Management
router.get('/users', UsersController.getUsers);
router.get('/users/:id', UsersController.getUserById);
router.put('/users/:id/status', UsersController.updateUserStatus);
router.put('/users/:id/role', UsersController.updateUserRole);

// Create new user from admin
const createUserValidator = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('role').optional().isIn(['customer', 'admin', 'moderator', 'editor', 'viewer', 'super_admin']).withMessage('Invalid role'),
];

router.post('/users', validate(createUserValidator), asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, phone, role } = req.body;
  
  // Check if email already exists
  if (await UserModel.emailExists(email)) {
    return sendError(res, 'Email already registered', 409);
  }
  
  const passwordHash = await hashPassword(password);
  const userId = await UserModel.create({
    email,
    password_hash: passwordHash,
    first_name: firstName,
    last_name: lastName,
    phone,
    role: role || 'customer',
  });
  
  const user = await UserModel.findById(userId);
  sendCreated(res, {
    id: user?.id,
    email: user?.email,
    firstName: user?.first_name,
    lastName: user?.last_name,
    phone: user?.phone,
    role: user?.role,
    status: user?.status,
    createdAt: user?.created_at,
  }, 'User created successfully');
}));

// Update user details
const updateUserValidator = [
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
];

router.put('/users/:id', validate(updateUserValidator), asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const { email, firstName, lastName, phone } = req.body;
  
  const user = await UserModel.findById(userId);
  if (!user) {
    return sendNotFound(res, 'User');
  }
  
  // If email is being changed, check it doesn't exist
  if (email && email !== user.email) {
    if (await UserModel.emailExists(email)) {
      return sendError(res, 'Email already registered', 409);
    }
  }
  
  const updateData: Record<string, string> = {};
  if (firstName) updateData.first_name = firstName;
  if (lastName) updateData.last_name = lastName;
  if (phone !== undefined) updateData.phone = phone;
  if (email) updateData.email = email;
  
  await UserModel.update(userId, updateData);
  
  const updatedUser = await UserModel.findById(userId);
  sendSuccess(res, {
    id: updatedUser?.id,
    email: updatedUser?.email,
    firstName: updatedUser?.first_name,
    lastName: updatedUser?.last_name,
    phone: updatedUser?.phone,
    role: updatedUser?.role,
    status: updatedUser?.status,
    createdAt: updatedUser?.created_at,
  }, 'User updated successfully');
}));

// Admin Password Reset for Users
const updateUserPasswordValidator = [
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
];

router.put('/users/:id/password', validate(updateUserPasswordValidator), asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const { newPassword } = req.body;
  
  const user = await UserModel.findById(userId);
  if (!user) {
    return sendNotFound(res, 'User');
  }
  
  const passwordHash = await hashPassword(newPassword);
  await UserModel.updatePassword(userId, passwordHash);
  
  // Revoke all user's tokens for security
  await TokenModel.deleteAllForUser(userId);
  
  sendSuccess(res, null, 'Password updated successfully');
}));

// Messages Management
router.get('/messages', asyncHandler(async (req, res) => {
  const { page, limit } = parsePagination(req.query as { page?: string; limit?: string });
  const offset = (page - 1) * limit;
  
  const [countResult] = await query<RowDataPacket[]>('SELECT COUNT(*) as total FROM contact_messages');
  const total = countResult.total as number;
  
  const messages = await query<RowDataPacket[]>(
    'SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT ? OFFSET ?',
    [limit, offset]
  );
  
  sendPaginated(res, messages, { page, limit, total });
}));

router.get('/messages/:id', asyncHandler(async (req, res) => {
  const [message] = await query<RowDataPacket[]>(
    'SELECT * FROM contact_messages WHERE id = ?',
    [req.params.id]
  );
  
  if (!message) {
    return sendNotFound(res, 'Message');
  }
  
  sendSuccess(res, message);
}));

router.put('/messages/:id/status', asyncHandler(async (req, res) => {
  const { status } = req.body;
  
  const result = await query<ResultSetHeader>(
    'UPDATE contact_messages SET status = ? WHERE id = ?',
    [status, req.params.id]
  );
  
  if (result.affectedRows === 0) {
    return sendNotFound(res, 'Message');
  }
  
  sendSuccess(res, null, 'Message status updated');
}));

// Settings
router.get('/settings', SettingsController.getSettings);
router.put('/settings', SettingsController.updateSettings);

export default router;

