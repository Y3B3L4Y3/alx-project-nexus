import { Request, Response } from 'express';
import UserModel, { toPublicUser } from '../../models/user.model';
import { sendSuccess, sendPaginated, sendNotFound } from '../../utils/response';
import { asyncHandler } from '../../middleware/error.middleware';
import { parsePagination } from '../../utils/pagination';
import { UserRole, UserStatus } from '../../types';

// Get all users
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = parsePagination(req.query as { page?: string; limit?: string });
  const role = req.query.role as UserRole | undefined;
  const status = req.query.status as UserStatus | undefined;
  const search = req.query.search as string | undefined;

  const { users, total } = await UserModel.findAll({ page, limit, role, status, search });
  const publicUsers = users.map(toPublicUser);

  sendPaginated(res, publicUsers, { page, limit, total });
});

// Get user by ID
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id, 10);
  const user = await UserModel.findById(userId);

  if (!user) {
    return sendNotFound(res, 'User');
  }

  sendSuccess(res, toPublicUser(user));
});

// Update user status
export const updateUserStatus = asyncHandler(async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id, 10);
  const { status } = req.body;

  const updated = await UserModel.updateStatus(userId, status);
  if (!updated) {
    return sendNotFound(res, 'User');
  }

  const user = await UserModel.findById(userId);
  sendSuccess(res, user ? toPublicUser(user) : null, 'User status updated');
});

// Update user role
export const updateUserRole = asyncHandler(async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id, 10);
  const { role } = req.body;

  const updated = await UserModel.updateRole(userId, role);
  if (!updated) {
    return sendNotFound(res, 'User');
  }

  const user = await UserModel.findById(userId);
  sendSuccess(res, user ? toPublicUser(user) : null, 'User role updated');
});

export default {
  getUsers,
  getUserById,
  updateUserStatus,
  updateUserRole,
};

