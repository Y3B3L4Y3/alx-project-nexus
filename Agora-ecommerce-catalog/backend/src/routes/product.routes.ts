import { Router } from 'express';
import ProductController from '../controllers/product.controller';
import ReviewController from '../controllers/review.controller';
import { validate } from '../middleware/validate.middleware';
import { authenticate, optionalAuth } from '../middleware/auth.middleware';
import { productQueryValidator } from '../validators/product.validator';
import { reviewValidator } from '../validators/order.validator';

const router = Router();

// Public product routes
router.get('/', validate(productQueryValidator), ProductController.getProducts);
router.get('/featured', ProductController.getFeaturedProducts);
router.get('/new-arrivals', ProductController.getNewArrivals);
router.get('/flash-sale', ProductController.getFlashSaleProducts);
router.get('/best-selling', ProductController.getBestSellingProducts);
router.get('/search', ProductController.searchProducts);
router.get('/slug/:slug', ProductController.getProductBySlug);
router.get('/:id', ProductController.getProductById);
router.get('/:id/related', ProductController.getRelatedProducts);

// Product reviews
router.get('/:id/reviews', ReviewController.getProductReviews);
router.post(
  '/:id/reviews',
  authenticate,
  validate(reviewValidator),
  ReviewController.addReview
);

export default router;

