import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import type { User, Order, Address, PaymentMethod, ApiResponse, ContactMessage } from './types';
import { 
  mockUser, 
  mockOrders,
  getUserOrders,
  getOrderById,
} from './mock';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['User', 'Order', 'Address', 'PaymentMethod'],
  endpoints: (builder) => ({
    // Get current user profile
    getCurrentUser: builder.query<ApiResponse<User>, void>({
      queryFn: async () => {
        await delay(200);
        
        return {
          data: {
            success: true,
            data: mockUser,
          },
        };
      },
      providesTags: ['User'],
    }),

    // Update user profile
    updateUserProfile: builder.mutation<ApiResponse<User>, Partial<User>>({
      queryFn: async (updates) => {
        await delay(300);
        
        // In real app, this would update the database
        const updatedUser = { ...mockUser, ...updates };
        
        return {
          data: {
            success: true,
            data: updatedUser,
            message: 'Profile updated successfully',
          },
        };
      },
      invalidatesTags: ['User'],
    }),

    // Get user orders
    getUserOrders: builder.query<ApiResponse<Order[]>, number | undefined>({
      queryFn: async (userId) => {
        await delay(250);
        
        const orders = getUserOrders(userId ?? mockUser.id);
        
        return {
          data: {
            success: true,
            data: orders,
          },
        };
      },
      providesTags: ['Order'],
    }),

    // Get single order by ID
    getOrderById: builder.query<ApiResponse<Order>, string>({
      queryFn: async (orderId) => {
        await delay(200);
        
        const order = getOrderById(orderId);
        
        if (!order) {
          return {
            error: {
              status: 404,
              data: { success: false, error: 'Order not found' },
            },
          };
        }
        
        return {
          data: {
            success: true,
            data: order,
          },
        };
      },
      providesTags: (_result, _error, orderId) => [{ type: 'Order', id: orderId }],
    }),

    // Create new order
    createOrder: builder.mutation<ApiResponse<Order>, {
      items: { productId: number; quantity: number; selectedColor?: string; selectedSize?: string }[];
      shippingAddressId: number;
      billingAddressId: number;
      paymentMethodId: number;
      couponCode?: string;
    }>({
      queryFn: async (_orderData) => {
        await delay(500);
        
        // Generate new order (mock)
        const newOrder: Order = {
          id: mockOrders.length + 1,
          orderId: `#ORD-2024-${String(mockOrders.length + 1).padStart(3, '0')}`,
          userId: mockUser.id,
          items: [], // Would be populated from cart
          subtotal: 0,
          shipping: 0,
          tax: 0,
          discount: 0,
          total: 0,
          status: 'pending',
          paymentMethod: 'Visa •••• 4242',
          paymentStatus: 'pending',
          shippingAddress: mockUser.addresses[0],
          billingAddress: mockUser.addresses[0],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        return {
          data: {
            success: true,
            data: newOrder,
            message: 'Order placed successfully',
          },
        };
      },
      invalidatesTags: ['Order'],
    }),

    // Cancel order
    cancelOrder: builder.mutation<ApiResponse<Order>, string>({
      queryFn: async (orderId) => {
        await delay(300);
        
        const order = getOrderById(orderId);
        
        if (!order) {
          return {
            error: {
              status: 404,
              data: { success: false, error: 'Order not found' },
            },
          };
        }
        
        if (order.status === 'delivered' || order.status === 'cancelled') {
          return {
            error: {
              status: 400,
              data: { success: false, error: 'Cannot cancel this order' },
            },
          };
        }
        
        const cancelledOrder = { ...order, status: 'cancelled' as const, paymentStatus: 'refunded' as const };
        
        return {
          data: {
            success: true,
            data: cancelledOrder,
            message: 'Order cancelled successfully',
          },
        };
      },
      invalidatesTags: ['Order'],
    }),

    // Get user addresses
    getUserAddresses: builder.query<ApiResponse<Address[]>, void>({
      queryFn: async () => {
        await delay(150);
        
        return {
          data: {
            success: true,
            data: mockUser.addresses,
          },
        };
      },
      providesTags: ['Address'],
    }),

    // Add new address
    addAddress: builder.mutation<ApiResponse<Address>, Omit<Address, 'id'>>({
      queryFn: async (addressData) => {
        await delay(300);
        
        const newAddress: Address = {
          ...addressData,
          id: mockUser.addresses.length + 1,
        };
        
        return {
          data: {
            success: true,
            data: newAddress,
            message: 'Address added successfully',
          },
        };
      },
      invalidatesTags: ['Address'],
    }),

    // Update address
    updateAddress: builder.mutation<ApiResponse<Address>, Address>({
      queryFn: async (addressData) => {
        await delay(300);
        
        return {
          data: {
            success: true,
            data: addressData,
            message: 'Address updated successfully',
          },
        };
      },
      invalidatesTags: ['Address'],
    }),

    // Delete address
    deleteAddress: builder.mutation<ApiResponse<null>, number>({
      queryFn: async (_addressId) => {
        await delay(200);
        
        return {
          data: {
            success: true,
            data: null,
            message: 'Address deleted successfully',
          },
        };
      },
      invalidatesTags: ['Address'],
    }),

    // Get user payment methods
    getUserPaymentMethods: builder.query<ApiResponse<PaymentMethod[]>, void>({
      queryFn: async () => {
        await delay(150);
        
        return {
          data: {
            success: true,
            data: mockUser.paymentMethods,
          },
        };
      },
      providesTags: ['PaymentMethod'],
    }),

    // Add payment method
    addPaymentMethod: builder.mutation<ApiResponse<PaymentMethod>, Omit<PaymentMethod, 'id'>>({
      queryFn: async (paymentData) => {
        await delay(400);
        
        const newPayment: PaymentMethod = {
          ...paymentData,
          id: mockUser.paymentMethods.length + 1,
        };
        
        return {
          data: {
            success: true,
            data: newPayment,
            message: 'Payment method added successfully',
          },
        };
      },
      invalidatesTags: ['PaymentMethod'],
    }),

    // Delete payment method
    deletePaymentMethod: builder.mutation<ApiResponse<null>, number>({
      queryFn: async (_paymentId) => {
        await delay(200);
        
        return {
          data: {
            success: true,
            data: null,
            message: 'Payment method deleted successfully',
          },
        };
      },
      invalidatesTags: ['PaymentMethod'],
    }),

    // Submit contact form
    submitContactForm: builder.mutation<ApiResponse<ContactMessage>, Omit<ContactMessage, 'id' | 'status' | 'createdAt'>>({
      queryFn: async (formData) => {
        await delay(400);
        
        const contactMessage: ContactMessage = {
          ...formData,
          id: Date.now(),
          status: 'new',
          createdAt: new Date().toISOString(),
        };
        
        return {
          data: {
            success: true,
            data: contactMessage,
            message: 'Message sent successfully! We will get back to you within 24 hours.',
          },
        };
      },
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useUpdateUserProfileMutation,
  useGetUserOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useCancelOrderMutation,
  useGetUserAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useGetUserPaymentMethodsQuery,
  useAddPaymentMethodMutation,
  useDeletePaymentMethodMutation,
  useSubmitContactFormMutation,
} = userApi;

