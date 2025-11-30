import { Request, Response } from 'express';
import AuthService from '../services/auth.service';
import { sendSuccess, sendCreated, sendError } from '../utils/response';
import { asyncHandler, AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../types';

// Register new user
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, firstName, lastName, phone } = req.body;

  const result = await AuthService.register({
    email,
    password,
    firstName,
    lastName,
    phone,
  });

  sendCreated(res, result, 'Registration successful');
});

// Login
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await AuthService.login(email, password);

  sendSuccess(res, result, 'Login successful');
});

// Admin login
export const adminLogin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await AuthService.adminLogin(email, password);

  sendSuccess(res, result, 'Admin login successful');
});

// Refresh token
export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  const result = await AuthService.refresh(refreshToken);

  sendSuccess(res, result, 'Token refreshed successfully');
});

// Logout
export const logout = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new AppError('Refresh token is required', 400);
  }

  await AuthService.logout(refreshToken);

  sendSuccess(res, null, 'Logout successful');
});

// Logout from all devices
export const logoutAll = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  await AuthService.logoutAll(req.user.userId);

  sendSuccess(res, null, 'Logged out from all devices');
});

// Change password
export const changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const { currentPassword, newPassword } = req.body;

  await AuthService.changePassword(req.user.userId, currentPassword, newPassword);

  sendSuccess(res, null, 'Password changed successfully');
});

// Forgot password (placeholder)
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  // TODO: Implement email sending
  console.log(`Password reset requested for: ${email}`);

  sendSuccess(res, null, 'If the email exists, a password reset link has been sent');
});

// Reset password (placeholder)
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, password } = req.body;

  // TODO: Implement token verification and password reset
  console.log(`Password reset with token: ${token}, new password length: ${password.length}`);

  sendSuccess(res, null, 'Password has been reset successfully');
});

// Verify email (placeholder)
export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.params;

  // TODO: Implement email verification
  console.log(`Email verification with token: ${token}`);

  sendSuccess(res, null, 'Email verified successfully');
});

export default {
  register,
  login,
  adminLogin,
  refreshToken,
  logout,
  logoutAll,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
};

