import { Response } from 'express';
import WishlistModel from '../models/wishlist.model';
import ProductModel from '../models/product.model';
import { sendSuccess, sendCreated, sendNotFound } from '../utils/response';
import { asyncHandler, AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../types';

// Get wishlist
export const getWishlist = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const items = await WishlistModel.findByUserId(req.user.userId);
  sendSuccess(res, items);
});

// Add to wishlist
export const addToWishlist = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const { productId } = req.body;

  // Check if product exists
  const product = await ProductModel.findById(productId);
  if (!product) {
    return sendNotFound(res, 'Product');
  }

  // Check if already in wishlist
  const exists = await WishlistModel.exists(req.user.userId, productId);
  if (exists) {
    const items = await WishlistModel.findByUserId(req.user.userId);
    return sendSuccess(res, items, 'Product already in wishlist');
  }

  await WishlistModel.add(req.user.userId, productId);
  const items = await WishlistModel.findByUserId(req.user.userId);
  sendCreated(res, items, 'Added to wishlist');
});

// Remove from wishlist
export const removeFromWishlist = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const productId = parseInt(req.params.productId, 10);

  const removed = await WishlistModel.remove(req.user.userId, productId);
  if (!removed) {
    return sendNotFound(res, 'Wishlist item');
  }

  const items = await WishlistModel.findByUserId(req.user.userId);
  sendSuccess(res, items, 'Removed from wishlist');
});

// Toggle wishlist
export const toggleWishlist = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const productId = parseInt(req.params.productId, 10);

  // Check if product exists
  const product = await ProductModel.findById(productId);
  if (!product) {
    return sendNotFound(res, 'Product');
  }

  const result = await WishlistModel.toggle(req.user.userId, productId);
  const items = await WishlistModel.findByUserId(req.user.userId);
  
  sendSuccess(
    res,
    { items, ...result },
    result.added ? 'Added to wishlist' : 'Removed from wishlist'
  );
});

export default {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
};

