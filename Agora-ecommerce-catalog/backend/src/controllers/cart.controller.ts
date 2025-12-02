import { Response } from 'express';
import CartModel from '../models/cart.model';
import ProductModel from '../models/product.model';
import { sendSuccess, sendCreated, sendNotFound, sendError } from '../utils/response';
import { asyncHandler, AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../types';

// Get cart
export const getCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const items = await CartModel.findByUserId(req.user.userId);
  
  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  sendSuccess(res, {
    items,
    subtotal,
    itemCount: items.length,
  });
});

// Add to cart
export const addToCart = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const { productId, quantity = 1, selectedColor, selectedSize } = req.body;

  // Check if product exists and has stock
  const product = await ProductModel.findById(productId);
  if (!product) {
    sendNotFound(res, 'Product');
    return;
  }

  if (product.stock < quantity) {
    sendError(res, 'Insufficient stock', 400);
    return;
  }

  await CartModel.addItem({
    user_id: req.user.userId,
    product_id: productId,
    quantity,
    selected_color: selectedColor,
    selected_size: selectedSize,
  });

  const items = await CartModel.findByUserId(req.user.userId);
  sendCreated(res, { items }, 'Added to cart');
});

// Update cart item
export const updateCartItem = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const itemId = parseInt(req.params.itemId, 10);
  const { quantity } = req.body;

  if (quantity < 1) {
    sendError(res, 'Quantity must be at least 1', 400);
    return;
  }

  const updated = await CartModel.updateQuantity(itemId, req.user.userId, quantity);
  if (!updated) {
    sendNotFound(res, 'Cart item');
    return;
  }

  const items = await CartModel.findByUserId(req.user.userId);
  sendSuccess(res, { items }, 'Cart updated');
});

// Remove from cart
export const removeFromCart = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const itemId = parseInt(req.params.itemId, 10);

  const removed = await CartModel.removeItem(itemId, req.user.userId);
  if (!removed) {
    sendNotFound(res, 'Cart item');
    return;
  }

  const items = await CartModel.findByUserId(req.user.userId);
  sendSuccess(res, { items }, 'Item removed from cart');
});

// Clear cart
export const clearCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  await CartModel.clearCart(req.user.userId);
  sendSuccess(res, { items: [] }, 'Cart cleared');
});

export default {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};

