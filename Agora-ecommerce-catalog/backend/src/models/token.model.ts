import { query } from '../config/database';
import { RefreshToken } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface TokenRow extends RefreshToken, RowDataPacket {}

// Create refresh token
export const create = async (
  userId: number,
  token: string,
  expiresAt: Date
): Promise<number> => {
  const result = await query<ResultSetHeader>(
    `INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)`,
    [userId, token, expiresAt]
  );
  return result.insertId;
};

// Find token by value
export const findByToken = async (token: string): Promise<RefreshToken | null> => {
  const tokens = await query<TokenRow[]>(
    'SELECT * FROM refresh_tokens WHERE token = ? AND expires_at > NOW()',
    [token]
  );
  return tokens[0] || null;
};

// Delete token
export const deleteToken = async (token: string): Promise<boolean> => {
  const result = await query<ResultSetHeader>(
    'DELETE FROM refresh_tokens WHERE token = ?',
    [token]
  );
  return result.affectedRows > 0;
};

// Delete all tokens for user
export const deleteAllForUser = async (userId: number): Promise<number> => {
  const result = await query<ResultSetHeader>(
    'DELETE FROM refresh_tokens WHERE user_id = ?',
    [userId]
  );
  return result.affectedRows;
};

// Delete expired tokens (cleanup job)
export const deleteExpired = async (): Promise<number> => {
  const result = await query<ResultSetHeader>(
    'DELETE FROM refresh_tokens WHERE expires_at <= NOW()'
  );
  return result.affectedRows;
};

export default {
  create,
  findByToken,
  deleteToken,
  deleteAllForUser,
  deleteExpired,
};

