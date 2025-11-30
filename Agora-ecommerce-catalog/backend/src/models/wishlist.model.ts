import { query } from '../config/database';
import { WishlistItem } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface WishlistRow extends WishlistItem, RowDataPacket {}

// Get user wishlist with product details
export const findByUserId = async (userId: number): Promise<WishlistRow[]> => {
  return query<WishlistRow[]>(
    `SELECT w.*, p.name, p.price, p.original_price, p.discount, p.thumbnail, p.rating, p.review_count, p.stock
     FROM wishlists w
     JOIN products p ON w.product_id = p.id
     WHERE w.user_id = ? AND p.status = 'active'
     ORDER BY w.added_at DESC`,
    [userId]
  );
};

// Check if product is in wishlist
export const exists = async (userId: number, productId: number): Promise<boolean> => {
  const result = await query<RowDataPacket[]>(
    'SELECT 1 FROM wishlists WHERE user_id = ? AND product_id = ?',
    [userId, productId]
  );
  return result.length > 0;
};

// Add to wishlist
export const add = async (userId: number, productId: number): Promise<number> => {
  const result = await query<ResultSetHeader>(
    'INSERT INTO wishlists (user_id, product_id) VALUES (?, ?)',
    [userId, productId]
  );
  return result.insertId;
};

// Remove from wishlist
export const remove = async (userId: number, productId: number): Promise<boolean> => {
  const result = await query<ResultSetHeader>(
    'DELETE FROM wishlists WHERE user_id = ? AND product_id = ?',
    [userId, productId]
  );
  return result.affectedRows > 0;
};

// Toggle wishlist item
export const toggle = async (userId: number, productId: number): Promise<{ added: boolean }> => {
  const isInWishlist = await exists(userId, productId);
  
  if (isInWishlist) {
    await remove(userId, productId);
    return { added: false };
  } else {
    await add(userId, productId);
    return { added: true };
  }
};

// Clear wishlist
export const clear = async (userId: number): Promise<number> => {
  const result = await query<ResultSetHeader>(
    'DELETE FROM wishlists WHERE user_id = ?',
    [userId]
  );
  return result.affectedRows;
};

export default {
  findByUserId,
  exists,
  add,
  remove,
  toggle,
  clear,
};

