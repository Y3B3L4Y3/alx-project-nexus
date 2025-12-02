import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { sendSuccess, sendCreated, sendNotFound } from '../utils/response';
import { asyncHandler, AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../types';
import { query } from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const router = Router();

// All payment routes require authentication
router.use(authenticate);

// Get payment methods
router.get('/', asyncHandler(async (req: AuthRequest, res) => {
  if (!req.user) throw new AppError('Authentication required', 401);
  
  const methods = await query<RowDataPacket[]>(
    'SELECT id, type, last_four, expiry_date, is_default FROM payment_methods WHERE user_id = ?',
    [req.user.userId]
  );
  sendSuccess(res, methods);
}));

// Add payment method
router.post('/', asyncHandler(async (req: AuthRequest, res) => {
  if (!req.user) throw new AppError('Authentication required', 401);
  
  const { type, lastFour, expiryDate, token, isDefault } = req.body;
  
  if (isDefault) {
    await query(
      'UPDATE payment_methods SET is_default = FALSE WHERE user_id = ?',
      [req.user.userId]
    );
  }
  
  const result = await query<ResultSetHeader>(
    'INSERT INTO payment_methods (user_id, type, last_four, expiry_date, token, is_default) VALUES (?, ?, ?, ?, ?, ?)',
    [req.user.userId, type, lastFour, expiryDate, token, isDefault || false]
  );
  
  sendCreated(res, { id: result.insertId }, 'Payment method added');
}));

// Delete payment method
router.delete('/:id', asyncHandler(async (req: AuthRequest, res): Promise<void> => {
  if (!req.user) throw new AppError('Authentication required', 401);
  
  const result = await query<ResultSetHeader>(
    'DELETE FROM payment_methods WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.userId]
  );
  
  if (result.affectedRows === 0) {
    sendNotFound(res, 'Payment method');
    return;
  }
  
  sendSuccess(res, null, 'Payment method deleted');
}));

// Set default
router.put('/:id/default', asyncHandler(async (req: AuthRequest, res): Promise<void> => {
  if (!req.user) throw new AppError('Authentication required', 401);
  
  await query(
    'UPDATE payment_methods SET is_default = FALSE WHERE user_id = ?',
    [req.user.userId]
  );
  
  const result = await query<ResultSetHeader>(
    'UPDATE payment_methods SET is_default = TRUE WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.userId]
  );
  
  if (result.affectedRows === 0) {
    sendNotFound(res, 'Payment method');
    return;
  }
  
  sendSuccess(res, null, 'Default payment method updated');
}));

export default router;

