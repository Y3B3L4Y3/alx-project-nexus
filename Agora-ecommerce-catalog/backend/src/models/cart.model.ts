import { query } from '../config/database';
import { CartItem } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface CartRow extends CartItem, RowDataPacket {}

// Get user cart items with product details
export const findByUserId = async (userId: number): Promise<CartRow[]> => {
  return query<CartRow[]>(
    `SELECT ci.*, p.name, p.price, p.thumbnail, p.stock
     FROM cart_items ci
     JOIN products p ON ci.product_id = p.id
     WHERE ci.user_id = ? AND p.status = 'active'
     ORDER BY ci.created_at DESC`,
    [userId]
  );
};

// Find cart item
export const findItem = async (userId: number, productId: number): Promise<CartItem | null> => {
  const items = await query<CartRow[]>(
    'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
    [userId, productId]
  );
  return items[0] || null;
};

// Add item to cart
export const addItem = async (cartData: {
  user_id: number;
  product_id: number;
  quantity: number;
  selected_color?: string;
  selected_size?: string;
}): Promise<number> => {
  // Check if item exists
  const existing = await findItem(cartData.user_id, cartData.product_id);
  
  if (existing) {
    // Update quantity
    await query<ResultSetHeader>(
      `UPDATE cart_items SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?`,
      [cartData.quantity, cartData.user_id, cartData.product_id]
    );
    return existing.id;
  }

  const result = await query<ResultSetHeader>(
    `INSERT INTO cart_items (user_id, product_id, quantity, selected_color, selected_size)
     VALUES (?, ?, ?, ?, ?)`,
    [
      cartData.user_id,
      cartData.product_id,
      cartData.quantity,
      cartData.selected_color || null,
      cartData.selected_size || null,
    ]
  );
  return result.insertId;
};

// Update cart item quantity
export const updateQuantity = async (itemId: number, userId: number, quantity: number): Promise<boolean> => {
  const result = await query<ResultSetHeader>(
    'UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?',
    [quantity, itemId, userId]
  );
  return result.affectedRows > 0;
};

// Remove item from cart
export const removeItem = async (itemId: number, userId: number): Promise<boolean> => {
  const result = await query<ResultSetHeader>(
    'DELETE FROM cart_items WHERE id = ? AND user_id = ?',
    [itemId, userId]
  );
  return result.affectedRows > 0;
};

// Clear user cart
export const clearCart = async (userId: number): Promise<number> => {
  const result = await query<ResultSetHeader>(
    'DELETE FROM cart_items WHERE user_id = ?',
    [userId]
  );
  return result.affectedRows;
};

export default {
  findByUserId,
  findItem,
  addItem,
  updateQuantity,
  removeItem,
  clearCart,
};

