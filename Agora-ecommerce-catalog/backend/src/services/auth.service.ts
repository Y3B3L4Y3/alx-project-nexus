import UserModel, { toPublicUser } from '../models/user.model';
import TokenModel from '../models/token.model';
import { hashPassword, comparePassword } from '../utils/password';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  getRefreshTokenExpiryDate,
} from '../utils/jwt';
import { UserPublic, UserRole } from '../types';
import { AppError } from '../middleware/error.middleware';

interface AuthResult {
  user: UserPublic;
  accessToken: string;
  refreshToken: string;
}

// Register new user
export const register = async (userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}): Promise<AuthResult> => {
  // Check if email exists
  if (await UserModel.emailExists(userData.email)) {
    throw new AppError('Email already registered', 409);
  }

  // Hash password
  const passwordHash = await hashPassword(userData.password);

  // Create user
  const userId = await UserModel.create({
    email: userData.email,
    password_hash: passwordHash,
    first_name: userData.firstName,
    last_name: userData.lastName,
    phone: userData.phone,
  });

  // Get created user
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new AppError('Failed to create user', 500);
  }

  // Generate tokens
  const accessToken = generateAccessToken(user.id, user.email, user.role);
  const { token: refreshToken, tokenId: _tokenId } = generateRefreshToken(user.id);

  // Store refresh token
  await TokenModel.create(user.id, refreshToken, getRefreshTokenExpiryDate());

  return {
    user: toPublicUser(user),
    accessToken,
    refreshToken,
  };
};

// Login user
export const login = async (
  email: string,
  password: string,
  requireRole?: UserRole
): Promise<AuthResult> => {
  // Find user
  const user = await UserModel.findByEmail(email);
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  // Check status
  if (user.status !== 'active') {
    throw new AppError('Account is suspended or deleted', 403);
  }

  // Check role if required
  if (requireRole && user.role !== requireRole) {
    throw new AppError('Insufficient permissions', 403);
  }

  // Verify password
  const isValidPassword = await comparePassword(password, user.password_hash);
  if (!isValidPassword) {
    throw new AppError('Invalid email or password', 401);
  }

  // Generate tokens
  const accessToken = generateAccessToken(user.id, user.email, user.role);
  const { token: refreshToken, tokenId: _tokenId } = generateRefreshToken(user.id);

  // Store refresh token
  await TokenModel.create(user.id, refreshToken, getRefreshTokenExpiryDate());

  return {
    user: toPublicUser(user),
    accessToken,
    refreshToken,
  };
};

// Admin login
export const adminLogin = async (
  email: string,
  password: string
): Promise<AuthResult> => {
  // Find user
  const user = await UserModel.findByEmail(email);
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  // Check if user has admin panel access (super_admin, admin, moderator, editor, viewer)
  const adminRoles = ['super_admin', 'admin', 'moderator', 'editor', 'viewer'];
  if (!adminRoles.includes(user.role)) {
    throw new AppError('Admin access required', 403);
  }

  // Check status
  if (user.status !== 'active') {
    throw new AppError('Account is suspended or deleted', 403);
  }

  // Verify password
  const isValidPassword = await comparePassword(password, user.password_hash);
  if (!isValidPassword) {
    throw new AppError('Invalid email or password', 401);
  }

  // Generate tokens
  const accessToken = generateAccessToken(user.id, user.email, user.role);
  const { token: refreshToken, tokenId: _tokenId } = generateRefreshToken(user.id);

  // Store refresh token
  await TokenModel.create(user.id, refreshToken, getRefreshTokenExpiryDate());

  return {
    user: toPublicUser(user),
    accessToken,
    refreshToken,
  };
};

// Refresh access token
export const refresh = async (refreshTokenValue: string): Promise<{
  accessToken: string;
  refreshToken: string;
}> => {
  // Verify token
  const payload = verifyRefreshToken(refreshTokenValue);
  if (!payload) {
    throw new AppError('Invalid refresh token', 401);
  }

  // Check if token exists in database
  const storedToken = await TokenModel.findByToken(refreshTokenValue);
  if (!storedToken) {
    throw new AppError('Refresh token not found or expired', 401);
  }

  // Get user
  const user = await UserModel.findById(payload.userId);
  if (!user || user.status !== 'active') {
    throw new AppError('User not found or inactive', 401);
  }

  // Delete old token
  await TokenModel.deleteToken(refreshTokenValue);

  // Generate new tokens
  const accessToken = generateAccessToken(user.id, user.email, user.role);
  const { token: refreshToken, tokenId: _tokenId } = generateRefreshToken(user.id);

  // Store new refresh token
  await TokenModel.create(user.id, refreshToken, getRefreshTokenExpiryDate());

  return { accessToken, refreshToken };
};

// Logout
export const logout = async (refreshTokenValue: string): Promise<void> => {
  await TokenModel.deleteToken(refreshTokenValue);
};

// Logout from all devices
export const logoutAll = async (userId: number): Promise<void> => {
  await TokenModel.deleteAllForUser(userId);
};

// Change password
export const changePassword = async (
  userId: number,
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  // Get user
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Verify current password
  const isValidPassword = await comparePassword(currentPassword, user.password_hash);
  if (!isValidPassword) {
    throw new AppError('Current password is incorrect', 400);
  }

  // Hash new password
  const passwordHash = await hashPassword(newPassword);

  // Update password
  await UserModel.updatePassword(userId, passwordHash);

  // Revoke all refresh tokens
  await TokenModel.deleteAllForUser(userId);
};

export default {
  register,
  login,
  adminLogin,
  refresh,
  logout,
  logoutAll,
  changePassword,
};

