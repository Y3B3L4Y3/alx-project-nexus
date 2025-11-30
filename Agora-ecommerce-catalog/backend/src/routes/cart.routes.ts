import { Router } from 'express';
import CartController from '../controllers/cart.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All cart routes require authentication
router.use(authenticate);

router.get('/', CartController.getCart);
router.post('/', CartController.addToCart);
router.put('/:itemId', CartController.updateCartItem);
router.delete('/:itemId', CartController.removeFromCart);
router.delete('/', CartController.clearCart);

export default router;

