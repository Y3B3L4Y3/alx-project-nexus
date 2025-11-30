import { query, transaction } from '../config/database';
import { Order, OrderItem, OrderStatus, PaymentStatus } from '../types';
import { RowDataPacket, ResultSetHeader, PoolConnection } from 'mysql2/promise';

interface OrderRow extends Order, RowDataPacket {}
interface OrderItemRow extends OrderItem, RowDataPacket {}

// Generate order ID
const generateOrderId = (): string => {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `#ORD-${year}-${random}`;
};

// Find order by ID
export const findById = async (id: number): Promise<Order | null> => {
  const orders = await query<OrderRow[]>(
    `SELECT o.*, 
            sa.name as shipping_name, sa.street as shipping_street, sa.city as shipping_city,
            sa.state as shipping_state, sa.country as shipping_country, sa.zip_code as shipping_zip
     FROM orders o
     LEFT JOIN addresses sa ON o.shipping_address_id = sa.id
     WHERE o.id = ?`,
    [id]
  );
  return orders[0] || null;
};

// Find order by order_id
export const findByOrderId = async (orderId: string): Promise<Order | null> => {
  const orders = await query<OrderRow[]>(
    'SELECT * FROM orders WHERE order_id = ?',
    [orderId]
  );
  return orders[0] || null;
};

// Get order items
export const getOrderItems = async (orderId: number): Promise<(OrderItem & { productName: string; productThumbnail: string })[]> => {
  return query<(OrderItemRow & { productName: string; productThumbnail: string })[]>(
    `SELECT oi.*, p.name as productName, p.thumbnail as productThumbnail
     FROM order_items oi
     JOIN products p ON oi.product_id = p.id
     WHERE oi.order_id = ?`,
    [orderId]
  );
};

// Get user orders
export const findByUserId = async (userId: number, page: number, limit: number): Promise<{ orders: Order[]; total: number }> => {
  const offset = (page - 1) * limit;

  const countResult = await query<RowDataPacket[]>(
    'SELECT COUNT(*) as total FROM orders WHERE user_id = ?',
    [userId]
  );
  const total = countResult[0].total as number;

  const orders = await query<OrderRow[]>(
    `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [userId, limit, offset]
  );

  return { orders, total };
};

// Create order
export const create = async (orderData: {
  user_id: number;
  items: { product_id: number; quantity: number; price: number; selected_color?: string; selected_size?: string }[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  payment_method: string;
  shipping_address_id: number;
  billing_address_id: number;
}): Promise<Order> => {
  return transaction(async (connection: PoolConnection) => {
    const orderId = generateOrderId();

    // Create order
    const [orderResult] = await connection.execute<ResultSetHeader>(
      `INSERT INTO orders (order_id, user_id, subtotal, shipping, tax, discount, total, 
       payment_method, shipping_address_id, billing_address_id, status, payment_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'pending')`,
      [
        orderId,
        orderData.user_id,
        orderData.subtotal,
        orderData.shipping,
        orderData.tax,
        orderData.discount,
        orderData.total,
        orderData.payment_method,
        orderData.shipping_address_id,
        orderData.billing_address_id,
      ]
    );

    const newOrderId = orderResult.insertId;

    // Create order items
    for (const item of orderData.items) {
      await connection.execute(
        `INSERT INTO order_items (order_id, product_id, quantity, price, selected_color, selected_size)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [newOrderId, item.product_id, item.quantity, item.price, item.selected_color || null, item.selected_size || null]
      );

      // Update product stock
      await connection.execute(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    // Get created order
    const [orders] = await connection.execute<OrderRow[]>(
      'SELECT * FROM orders WHERE id = ?',
      [newOrderId]
    );

    return orders[0];
  });
};

// Update order status
export const updateStatus = async (id: number, status: OrderStatus): Promise<boolean> => {
  const result = await query<ResultSetHeader>(
    'UPDATE orders SET status = ? WHERE id = ?',
    [status, id]
  );
  return result.affectedRows > 0;
};

// Update payment status
export const updatePaymentStatus = async (id: number, paymentStatus: PaymentStatus): Promise<boolean> => {
  const result = await query<ResultSetHeader>(
    'UPDATE orders SET payment_status = ? WHERE id = ?',
    [paymentStatus, id]
  );
  return result.affectedRows > 0;
};

// Update tracking
export const updateTracking = async (id: number, trackingNumber: string, estimatedDelivery?: Date): Promise<boolean> => {
  const result = await query<ResultSetHeader>(
    'UPDATE orders SET tracking_number = ?, estimated_delivery = ? WHERE id = ?',
    [trackingNumber, estimatedDelivery || null, id]
  );
  return result.affectedRows > 0;
};

// Cancel order
export const cancel = async (id: number, userId: number): Promise<boolean> => {
  return transaction(async (connection: PoolConnection) => {
    // Check if order belongs to user and can be cancelled
    const [orders] = await connection.execute<OrderRow[]>(
      "SELECT * FROM orders WHERE id = ? AND user_id = ? AND status IN ('pending', 'processing')",
      [id, userId]
    );

    if (orders.length === 0) return false;

    // Get order items to restore stock
    const [items] = await connection.execute<OrderItemRow[]>(
      'SELECT * FROM order_items WHERE order_id = ?',
      [id]
    );

    // Restore stock
    for (const item of items) {
      await connection.execute(
        'UPDATE products SET stock = stock + ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    // Update order status
    await connection.execute(
      "UPDATE orders SET status = 'cancelled', payment_status = 'refunded' WHERE id = ?",
      [id]
    );

    return true;
  });
};

// Get all orders (admin)
export const findAll = async (page: number, limit: number, status?: OrderStatus): Promise<{ orders: Order[]; total: number }> => {
  const offset = (page - 1) * limit;
  
  let whereClause = '';
  const params: unknown[] = [];

  if (status) {
    whereClause = 'WHERE o.status = ?';
    params.push(status);
  }

  const countResult = await query<RowDataPacket[]>(
    `SELECT COUNT(*) as total FROM orders o ${whereClause}`,
    params
  );
  const total = countResult[0].total as number;

  const orders = await query<OrderRow[]>(
    `SELECT o.*, u.first_name, u.last_name, u.email
     FROM orders o
     JOIN users u ON o.user_id = u.id
     ${whereClause}
     ORDER BY o.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return { orders, total };
};

export default {
  findById,
  findByOrderId,
  getOrderItems,
  findByUserId,
  create,
  updateStatus,
  updatePaymentStatus,
  updateTracking,
  cancel,
  findAll,
};

