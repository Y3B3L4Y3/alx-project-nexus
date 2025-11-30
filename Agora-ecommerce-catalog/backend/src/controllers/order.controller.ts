import { Response } from 'express';
import OrderModel from '../models/order.model';
import CartModel from '../models/cart.model';
import ProductModel from '../models/product.model';
import AddressModel from '../models/address.model';
import { sendSuccess, sendCreated, sendPaginated, sendNotFound, sendError } from '../utils/response';
import { asyncHandler, AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../types';
import { parsePagination } from '../utils/pagination';

// Get user orders
export const getOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const { page, limit } = parsePagination(req.query as { page?: string; limit?: string });
  const { orders, total } = await OrderModel.findByUserId(req.user.userId, page, limit);

  // Get items for each order
  const ordersWithItems = await Promise.all(
    orders.map(async (order) => {
      const items = await OrderModel.getOrderItems(order.id);
      return { ...order, items };
    })
  );

  sendPaginated(res, ordersWithItems, { page, limit, total });
});

// Get order by ID
export const getOrderById = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const order = await OrderModel.findByOrderId(req.params.orderId);

  if (!order || order.user_id !== req.user.userId) {
    return sendNotFound(res, 'Order');
  }

  const items = await OrderModel.getOrderItems(order.id);
  const shippingAddress = await AddressModel.findById(order.shipping_address_id);
  const billingAddress = await AddressModel.findById(order.billing_address_id);

  sendSuccess(res, {
    ...order,
    items,
    shippingAddress,
    billingAddress,
  });
});

// Create order
export const createOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const { items, shippingAddressId, billingAddressId, paymentMethodId, couponCode } = req.body;

  // Validate addresses
  const shippingAddress = await AddressModel.findById(shippingAddressId);
  if (!shippingAddress || shippingAddress.user_id !== req.user.userId) {
    return sendError(res, 'Invalid shipping address', 400);
  }

  const billingAddress = await AddressModel.findById(billingAddressId);
  if (!billingAddress || billingAddress.user_id !== req.user.userId) {
    return sendError(res, 'Invalid billing address', 400);
  }

  // Validate and get product details
  const orderItems = [];
  let subtotal = 0;

  for (const item of items) {
    const product = await ProductModel.findById(item.productId);
    if (!product) {
      return sendError(res, `Product ${item.productId} not found`, 400);
    }
    if (product.stock < item.quantity) {
      return sendError(res, `Insufficient stock for ${product.name}`, 400);
    }

    orderItems.push({
      product_id: item.productId,
      quantity: item.quantity,
      price: product.price,
      selected_color: item.selectedColor,
      selected_size: item.selectedSize,
    });

    subtotal += product.price * item.quantity;
  }

  // Calculate totals
  const shipping = subtotal >= 100 ? 0 : 9.99;
  const taxRate = 0.08; // 8% tax
  const tax = subtotal * taxRate;
  let discount = 0;

  // Apply coupon (placeholder)
  if (couponCode) {
    // TODO: Implement coupon logic
    discount = 0;
  }

  const total = subtotal + shipping + tax - discount;

  // Create order
  const order = await OrderModel.create({
    user_id: req.user.userId,
    items: orderItems,
    subtotal,
    shipping,
    tax,
    discount,
    total,
    payment_method: `Payment Method #${paymentMethodId}`, // TODO: Get actual payment method
    shipping_address_id: shippingAddressId,
    billing_address_id: billingAddressId,
  });

  // Clear cart after successful order
  await CartModel.clearCart(req.user.userId);

  sendCreated(res, order, 'Order placed successfully');
});

// Cancel order
export const cancelOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const order = await OrderModel.findByOrderId(req.params.orderId);

  if (!order) {
    return sendNotFound(res, 'Order');
  }

  if (order.user_id !== req.user.userId) {
    return sendError(res, 'Unauthorized', 403);
  }

  if (order.status === 'delivered' || order.status === 'cancelled') {
    return sendError(res, 'Cannot cancel this order', 400);
  }

  const cancelled = await OrderModel.cancel(order.id, req.user.userId);
  if (!cancelled) {
    return sendError(res, 'Failed to cancel order', 400);
  }

  const updatedOrder = await OrderModel.findById(order.id);
  sendSuccess(res, updatedOrder, 'Order cancelled successfully');
});

export default {
  getOrders,
  getOrderById,
  createOrder,
  cancelOrder,
};

