import { Request, Response } from 'express';
import { sendSuccess } from '../../utils/response';
import { asyncHandler } from '../../middleware/error.middleware';
import { query } from '../../config/database';
import { RowDataPacket } from 'mysql2';

// Get dashboard statistics
export const getStats = asyncHandler(async (_req: Request, res: Response) => {
  // Total sales
  const [salesResult] = await query<RowDataPacket[]>(
    "SELECT COALESCE(SUM(total), 0) as totalSales FROM orders WHERE payment_status = 'paid'"
  );

  // Total orders
  const [ordersResult] = await query<RowDataPacket[]>(
    'SELECT COUNT(*) as totalOrders FROM orders'
  );

  // Total users
  const [usersResult] = await query<RowDataPacket[]>(
    "SELECT COUNT(*) as totalUsers FROM users WHERE status != 'deleted'"
  );

  // Total products
  const [productsResult] = await query<RowDataPacket[]>(
    "SELECT COUNT(*) as totalProducts FROM products WHERE status != 'deleted'"
  );

  // Today's stats
  const today = new Date().toISOString().split('T')[0];
  
  const [todayOrders] = await query<RowDataPacket[]>(
    'SELECT COUNT(*) as count FROM orders WHERE DATE(created_at) = ?',
    [today]
  );

  const [pendingOrders] = await query<RowDataPacket[]>(
    "SELECT COUNT(*) as count FROM orders WHERE status = 'pending'"
  );

  const [newMessages] = await query<RowDataPacket[]>(
    "SELECT COUNT(*) as count FROM contact_messages WHERE status = 'new'"
  );

  const [newUsers] = await query<RowDataPacket[]>(
    'SELECT COUNT(*) as count FROM users WHERE DATE(created_at) = ?',
    [today]
  );

  sendSuccess(res, {
    totalSales: salesResult.totalSales || 0,
    totalOrders: ordersResult.totalOrders || 0,
    totalUsers: usersResult.totalUsers || 0,
    totalProducts: productsResult.totalProducts || 0,
    totalRevenue: salesResult.totalSales || 0, // Revenue equals sales for now
    newOrdersToday: todayOrders.count || 0,
    pendingOrders: pendingOrders.count || 0,
    newMessagesToday: newMessages.count || 0,
    newUsersToday: newUsers.count || 0,
  });
});

// Get sales analytics
export const getSales = asyncHandler(async (req: Request, res: Response) => {
  const days = parseInt(req.query.days as string) || 30;
  
  const salesData = await query<RowDataPacket[]>(
    `SELECT DATE(created_at) as date, SUM(total) as sales, COUNT(*) as orders
     FROM orders
     WHERE payment_status = 'paid' AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
     GROUP BY DATE(created_at)
     ORDER BY date`,
    [days]
  );

  sendSuccess(res, salesData);
});

// Get orders chart data
export const getOrdersChart = asyncHandler(async (req: Request, res: Response) => {
  const days = parseInt(req.query.days as string) || 7;
  
  const ordersData = await query<RowDataPacket[]>(
    `SELECT DATE(created_at) as date, status, COUNT(*) as count
     FROM orders
     WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
     GROUP BY DATE(created_at), status
     ORDER BY date`,
    [days]
  );

  sendSuccess(res, ordersData);
});

export default {
  getStats,
  getSales,
  getOrdersChart,
};

