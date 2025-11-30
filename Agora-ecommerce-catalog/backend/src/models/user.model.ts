import { query, pool } from '../config/database';
import { User, UserRole, UserStatus, UserPublic } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface UserRow extends User, RowDataPacket {}

// Transform database user to public user
export const toPublicUser = (user: User): UserPublic => ({
  id: user.id,
  email: user.email,
  firstName: user.first_name,
  lastName: user.last_name,
  phone: user.phone,
  avatar: user.avatar,
  role: user.role,
  createdAt: user.created_at.toISOString(),
});

// Find user by ID
export const findById = async (id: number): Promise<User | null> => {
  const users = await query<UserRow[]>(
    'SELECT * FROM users WHERE id = ? AND status != ?',
    [id, 'deleted']
  );
  return users[0] || null;
};

// Find user by email
export const findByEmail = async (email: string): Promise<User | null> => {
  const users = await query<UserRow[]>(
    'SELECT * FROM users WHERE email = ? AND status != ?',
    [email, 'deleted']
  );
  return users[0] || null;
};

// Create new user
export const create = async (userData: {
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role?: UserRole;
}): Promise<number> => {
  const result = await query<ResultSetHeader>(
    `INSERT INTO users (email, password_hash, first_name, last_name, phone, role)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      userData.email,
      userData.password_hash,
      userData.first_name,
      userData.last_name,
      userData.phone || null,
      userData.role || 'customer',
    ]
  );
  return result.insertId;
};

// Update user
export const update = async (
  id: number,
  userData: Partial<{
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    avatar: string;
    email_verified: boolean;
  }>
): Promise<boolean> => {
  const fields: string[] = [];
  const values: unknown[] = [];

  Object.entries(userData).forEach(([key, value]) => {
    if (value !== undefined) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  });

  if (fields.length === 0) return false;

  values.push(id);
  const result = await query<ResultSetHeader>(
    `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
  return result.affectedRows > 0;
};

// Update password
export const updatePassword = async (
  id: number,
  passwordHash: string
): Promise<boolean> => {
  const result = await query<ResultSetHeader>(
    'UPDATE users SET password_hash = ? WHERE id = ?',
    [passwordHash, id]
  );
  return result.affectedRows > 0;
};

// Update user status
export const updateStatus = async (
  id: number,
  status: UserStatus
): Promise<boolean> => {
  const result = await query<ResultSetHeader>(
    'UPDATE users SET status = ? WHERE id = ?',
    [status, id]
  );
  return result.affectedRows > 0;
};

// Update user role
export const updateRole = async (
  id: number,
  role: UserRole
): Promise<boolean> => {
  const result = await query<ResultSetHeader>(
    'UPDATE users SET role = ? WHERE id = ?',
    [role, id]
  );
  return result.affectedRows > 0;
};

// Get all users (for admin)
export const findAll = async (options: {
  page: number;
  limit: number;
  role?: UserRole;
  status?: UserStatus;
  search?: string;
}): Promise<{ users: User[]; total: number }> => {
  const { page, limit, role, status, search } = options;
  const offset = (page - 1) * limit;
  
  let whereClause = 'WHERE status != ?';
  const params: unknown[] = ['deleted'];

  if (role) {
    whereClause += ' AND role = ?';
    params.push(role);
  }

  if (status) {
    whereClause += ' AND status = ?';
    params.push(status);
  }

  if (search) {
    whereClause += ' AND (email LIKE ? OR first_name LIKE ? OR last_name LIKE ?)';
    const searchPattern = `%${search}%`;
    params.push(searchPattern, searchPattern, searchPattern);
  }

  // Get total count
  const countResult = await query<RowDataPacket[]>(
    `SELECT COUNT(*) as total FROM users ${whereClause}`,
    params
  );
  const total = countResult[0].total as number;

  // Get users
  const users = await query<UserRow[]>(
    `SELECT * FROM users ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return { users, total };
};

// Soft delete user
export const softDelete = async (id: number): Promise<boolean> => {
  return updateStatus(id, 'deleted');
};

// Check if email exists
export const emailExists = async (email: string): Promise<boolean> => {
  const result = await query<RowDataPacket[]>(
    'SELECT 1 FROM users WHERE email = ?',
    [email]
  );
  return result.length > 0;
};

export default {
  findById,
  findByEmail,
  create,
  update,
  updatePassword,
  updateStatus,
  updateRole,
  findAll,
  softDelete,
  emailExists,
  toPublicUser,
};

