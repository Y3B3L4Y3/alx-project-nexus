import { Router } from 'express';
import OrderController from '../controllers/order.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createOrderValidator } from '../validators/order.validator';

const router = Router();

// All order routes require authentication
router.use(authenticate);

router.get('/', OrderController.getOrders);
router.get('/:orderId', OrderController.getOrderById);
router.post('/', validate(createOrderValidator), OrderController.createOrder);
router.post('/:orderId/cancel', OrderController.cancelOrder);

export default router;

