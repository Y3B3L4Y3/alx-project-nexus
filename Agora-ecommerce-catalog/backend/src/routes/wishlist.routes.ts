import { Router } from 'express';
import WishlistController from '../controllers/wishlist.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All wishlist routes require authentication
router.use(authenticate);

router.get('/', WishlistController.getWishlist);
router.post('/', WishlistController.addToWishlist);
router.delete('/:productId', WishlistController.removeFromWishlist);
router.post('/:productId/toggle', WishlistController.toggleWishlist);

export default router;

