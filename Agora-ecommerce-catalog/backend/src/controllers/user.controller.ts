import { Response } from 'express';
import UserModel, { toPublicUser } from '../models/user.model';
import { sendSuccess, sendNotFound } from '../utils/response';
import { asyncHandler, AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../types';

// Get current user profile
export const getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const user = await UserModel.findById(req.user.userId);
  if (!user) {
    return sendNotFound(res, 'User');
  }

  sendSuccess(res, toPublicUser(user));
});

// Update current user profile
export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const { firstName, lastName, phone, avatar } = req.body;

  const updateData: Record<string, string> = {};
  if (firstName) updateData.first_name = firstName;
  if (lastName) updateData.last_name = lastName;
  if (phone !== undefined) updateData.phone = phone;
  if (avatar !== undefined) updateData.avatar = avatar;

  await UserModel.update(req.user.userId, updateData);

  const user = await UserModel.findById(req.user.userId);
  if (!user) {
    return sendNotFound(res, 'User');
  }

  sendSuccess(res, toPublicUser(user), 'Profile updated successfully');
});

// Delete account (soft delete)
export const deleteAccount = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  await UserModel.softDelete(req.user.userId);

  sendSuccess(res, null, 'Account deleted successfully');
});

export default {
  getProfile,
  updateProfile,
  deleteAccount,
};

