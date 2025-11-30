import { Request, Response } from 'express';
import ReviewModel from '../models/review.model';
import ProductModel from '../models/product.model';
import { sendSuccess, sendCreated, sendNotFound, sendError } from '../utils/response';
import { asyncHandler, AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../types';

// Get product reviews
export const getProductReviews = asyncHandler(async (req: Request, res: Response) => {
  const productId = parseInt(req.params.id, 10);
  const reviews = await ReviewModel.findByProductId(productId);
  sendSuccess(res, reviews);
});

// Add review
export const addReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const productId = parseInt(req.params.id, 10);
  const { rating, title, comment } = req.body;

  // Check if product exists
  const product = await ProductModel.findById(productId);
  if (!product) {
    return sendNotFound(res, 'Product');
  }

  // Check if user already reviewed
  const existingReview = await ReviewModel.userReviewExists(req.user.userId, productId);
  if (existingReview) {
    return sendError(res, 'You have already reviewed this product', 400);
  }

  // Create review
  const reviewId = await ReviewModel.create({
    product_id: productId,
    user_id: req.user.userId,
    rating,
    title,
    comment,
  });

  // Update product rating
  await ProductModel.updateRating(productId);

  const review = await ReviewModel.findById(reviewId);
  sendCreated(res, review, 'Review added successfully');
});

// Update review
export const updateReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const reviewId = parseInt(req.params.id, 10);
  const { rating, title, comment } = req.body;

  const review = await ReviewModel.findById(reviewId);
  if (!review) {
    return sendNotFound(res, 'Review');
  }

  const updated = await ReviewModel.update(reviewId, req.user.userId, {
    rating,
    title,
    comment,
  });

  if (!updated) {
    return sendError(res, 'Failed to update review', 400);
  }

  // Update product rating
  await ProductModel.updateRating(review.product_id);

  const updatedReview = await ReviewModel.findById(reviewId);
  sendSuccess(res, updatedReview, 'Review updated successfully');
});

// Delete review
export const deleteReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const reviewId = parseInt(req.params.id, 10);
  
  const review = await ReviewModel.findById(reviewId);
  if (!review) {
    return sendNotFound(res, 'Review');
  }

  const deleted = await ReviewModel.remove(reviewId, req.user.userId);
  if (!deleted) {
    return sendError(res, 'Failed to delete review', 400);
  }

  // Update product rating
  await ProductModel.updateRating(review.product_id);

  sendSuccess(res, null, 'Review deleted successfully');
});

// Mark review as helpful
export const markHelpful = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const reviewId = parseInt(req.params.id, 10);
  
  const updated = await ReviewModel.incrementHelpful(reviewId);
  if (!updated) {
    return sendNotFound(res, 'Review');
  }

  sendSuccess(res, null, 'Marked as helpful');
});

export default {
  getProductReviews,
  addReview,
  updateReview,
  deleteReview,
  markHelpful,
};

