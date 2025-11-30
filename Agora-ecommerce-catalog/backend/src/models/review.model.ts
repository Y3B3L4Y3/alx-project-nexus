import { query } from '../config/database';
import { Review } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface ReviewRow extends Review, RowDataPacket {}

// Find review by ID
export const findById = async (id: number): Promise<Review | null> => {
  const reviews = await query<ReviewRow[]>(
    'SELECT * FROM reviews WHERE id = ?',
    [id]
  );
  return reviews[0] || null;
};

// Get reviews for product
export const findByProductId = async (productId: number): Promise<(Review & { userName: string; userAvatar?: string })[]> => {
  return query<(ReviewRow & { userName: string; userAvatar?: string })[]>(
    `SELECT r.*, CONCAT(u.first_name, ' ', u.last_name) as userName, u.avatar as userAvatar
     FROM reviews r
     JOIN users u ON r.user_id = u.id
     WHERE r.product_id = ?
     ORDER BY r.created_at DESC`,
    [productId]
  );
};

// Check if user already reviewed product
export const userReviewExists = async (userId: number, productId: number): Promise<boolean> => {
  const result = await query<RowDataPacket[]>(
    'SELECT 1 FROM reviews WHERE user_id = ? AND product_id = ?',
    [userId, productId]
  );
  return result.length > 0;
};

// Create review
export const create = async (reviewData: {
  product_id: number;
  user_id: number;
  rating: number;
  title: string;
  comment: string;
  verified_purchase?: boolean;
}): Promise<number> => {
  const result = await query<ResultSetHeader>(
    `INSERT INTO reviews (product_id, user_id, rating, title, comment, verified_purchase)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      reviewData.product_id,
      reviewData.user_id,
      reviewData.rating,
      reviewData.title,
      reviewData.comment,
      reviewData.verified_purchase || false,
    ]
  );
  return result.insertId;
};

// Update review
export const update = async (id: number, userId: number, reviewData: Partial<Review>): Promise<boolean> => {
  const fields: string[] = [];
  const values: unknown[] = [];

  if (reviewData.rating !== undefined) {
    fields.push('rating = ?');
    values.push(reviewData.rating);
  }
  if (reviewData.title !== undefined) {
    fields.push('title = ?');
    values.push(reviewData.title);
  }
  if (reviewData.comment !== undefined) {
    fields.push('comment = ?');
    values.push(reviewData.comment);
  }

  if (fields.length === 0) return false;

  values.push(id, userId);
  const result = await query<ResultSetHeader>(
    `UPDATE reviews SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`,
    values
  );
  return result.affectedRows > 0;
};

// Delete review
export const remove = async (id: number, userId: number): Promise<boolean> => {
  const result = await query<ResultSetHeader>(
    'DELETE FROM reviews WHERE id = ? AND user_id = ?',
    [id, userId]
  );
  return result.affectedRows > 0;
};

// Increment helpful count
export const incrementHelpful = async (id: number): Promise<boolean> => {
  const result = await query<ResultSetHeader>(
    'UPDATE reviews SET helpful = helpful + 1 WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
};

export default {
  findById,
  findByProductId,
  userReviewExists,
  create,
  update,
  remove,
  incrementHelpful,
};

