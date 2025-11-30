import { Router } from 'express';
import ReviewController from '../controllers/review.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { reviewValidator } from '../validators/order.validator';

const router = Router();

// Protected routes
router.put('/:id', authenticate, validate(reviewValidator), ReviewController.updateReview);
router.delete('/:id', authenticate, ReviewController.deleteReview);
router.post('/:id/helpful', authenticate, ReviewController.markHelpful);

export default router;

