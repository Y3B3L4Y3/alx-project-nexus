import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { authLimiter, passwordResetLimiter } from '../middleware/rateLimit.middleware';
import {
  registerValidator,
  loginValidator,
  refreshTokenValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  changePasswordValidator,
} from '../validators/auth.validator';

const router = Router();

// Public routes
router.post(
  '/register',
  authLimiter,
  validate(registerValidator),
  AuthController.register
);

router.post(
  '/login',
  authLimiter,
  validate(loginValidator),
  AuthController.login
);

router.post(
  '/admin/login',
  authLimiter,
  validate(loginValidator),
  AuthController.adminLogin
);

router.post(
  '/refresh',
  validate(refreshTokenValidator),
  AuthController.refreshToken
);

router.post(
  '/forgot-password',
  passwordResetLimiter,
  validate(forgotPasswordValidator),
  AuthController.forgotPassword
);

router.post(
  '/reset-password',
  passwordResetLimiter,
  validate(resetPasswordValidator),
  AuthController.resetPassword
);

router.get('/verify-email/:token', AuthController.verifyEmail);

// Protected routes
router.post('/logout', authenticate, AuthController.logout);
router.post('/logout-all', authenticate, AuthController.logoutAll);

router.put(
  '/change-password',
  authenticate,
  validate(changePasswordValidator),
  AuthController.changePassword
);

export default router;

