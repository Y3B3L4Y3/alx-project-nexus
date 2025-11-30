import { Router } from 'express';
import UserController from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// User profile
router.get('/me', UserController.getProfile);
router.put('/me', UserController.updateProfile);
router.delete('/me', UserController.deleteAccount);

export default router;

