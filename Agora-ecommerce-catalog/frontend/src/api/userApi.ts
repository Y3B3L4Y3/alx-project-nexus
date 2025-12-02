import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';
import type { User, Order, Address, PaymentMethod, ApiResponse, ContactMessage } from './types';

// Transform backend user to frontend format
const transformUser = (backendUser: any): User => ({
  id: backendUser.id,
  firstName: backendUser.firstName || backendUser.first_name,
  lastName: backendUser.lastName || backendUser.last_name,
  email: backendUser.email,
  phone: backendUser.phone,
  avatar: backendUser.avatar,
  addresses: [],
  paymentMethods: [],
  createdAt: backendUser.createdAt || backendUser.created_at,
});

// Transform backend order to frontend format
const transformOrder = (backendOrder: any): Order => ({
  id: backendOrder.id,
  orderId: backendOrder.order_id || backendOrder.orderId,
  userId: backendOrder.user_id || backendOrder.userId,
  items: (backendOrder.items || []).map((item: any) => ({
    id: item.id,
    productId: item.product_id || item.productId,
    product: item.product,
    quantity: item.quantity,
    price: parseFloat(item.price),
    selectedColor: item.selected_color || item.selectedColor,
    selectedSize: item.selected_size || item.selectedSize,
  })),
  subtotal: parseFloat(backendOrder.subtotal),
  shipping: parseFloat(backendOrder.shipping),
  tax: parseFloat(backendOrder.tax),
  discount: parseFloat(backendOrder.discount || 0),
  total: parseFloat(backendOrder.total),
  status: backendOrder.status,
  paymentMethod: backendOrder.payment_method || backendOrder.paymentMethod,
  paymentStatus: backendOrder.payment_status || backendOrder.paymentStatus,
  shippingAddress: backendOrder.shipping_address || backendOrder.shippingAddress,
  billingAddress: backendOrder.billing_address || backendOrder.billingAddress,
  trackingNumber: backendOrder.tracking_number || backendOrder.trackingNumber,
  estimatedDelivery: backendOrder.estimated_delivery || backendOrder.estimatedDelivery,
  createdAt: backendOrder.created_at || backendOrder.createdAt,
  updatedAt: backendOrder.updated_at || backendOrder.updatedAt,
});

// Transform backend address to frontend format
const transformAddress = (backendAddress: any): Address => ({
  id: backendAddress.id,
  name: backendAddress.name,
  phone: backendAddress.phone,
  street: backendAddress.street,
  apartment: backendAddress.apartment,
  city: backendAddress.city,
  state: backendAddress.state,
  country: backendAddress.country,
  zipCode: backendAddress.zip_code || backendAddress.zipCode,
  isDefault: Boolean(backendAddress.is_default || backendAddress.isDefault),
});

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Order', 'Address', 'PaymentMethod'],
  endpoints: (builder) => ({
    // Get current user profile
    getCurrentUser: builder.query<ApiResponse<User>, void>({
      query: () => '/user/me',
      transformResponse: (response: any): ApiResponse<User> => ({
        success: response.success,
        data: transformUser(response.data),
        message: response.message,
      }),
      providesTags: ['User'],
    }),

    // Update user profile
    updateUserProfile: builder.mutation<ApiResponse<User>, Partial<User>>({
      query: (updates) => ({
        url: '/user/me',
        method: 'PUT',
        body: {
          firstName: updates.firstName,
          lastName: updates.lastName,
          phone: updates.phone,
          avatar: updates.avatar,
        },
      }),
      transformResponse: (response: any): ApiResponse<User> => ({
        success: response.success,
        data: transformUser(response.data),
        message: response.message,
      }),
      invalidatesTags: ['User'],
    }),

    // Get user orders
    getUserOrders: builder.query<ApiResponse<Order[]>, void>({
      query: () => '/orders',
      transformResponse: (response: any): ApiResponse<Order[]> => ({
        success: response.success,
        data: (response.data || []).map(transformOrder),
        message: response.message,
      }),
      providesTags: ['Order'],
    }),

    // Get single order by ID
    getOrderById: builder.query<ApiResponse<Order>, string>({
      query: (orderId) => `/orders/${orderId}`,
      transformResponse: (response: any): ApiResponse<Order> => ({
        success: response.success,
        data: transformOrder(response.data),
        message: response.message,
      }),
      providesTags: (_result, _error, orderId) => [{ type: 'Order', id: orderId }],
    }),

    // Create new order
    createOrder: builder.mutation<ApiResponse<Order>, {
      items: { productId: number; quantity: number; selectedColor?: string; selectedSize?: string }[];
      shippingAddressId: number;
      billingAddressId: number;
      paymentMethod: string;
      couponCode?: string;
    }>({
      query: (orderData) => ({
        url: '/orders',
        method: 'POST',
        body: {
          items: orderData.items.map(item => ({
            product_id: item.productId,
            quantity: item.quantity,
            selected_color: item.selectedColor,
            selected_size: item.selectedSize,
          })),
          shipping_address_id: orderData.shippingAddressId,
          billing_address_id: orderData.billingAddressId,
          payment_method: orderData.paymentMethod,
          coupon_code: orderData.couponCode,
        },
      }),
      transformResponse: (response: any): ApiResponse<Order> => ({
        success: response.success,
        data: transformOrder(response.data),
        message: response.message,
      }),
      invalidatesTags: ['Order'],
    }),

    // Cancel order
    cancelOrder: builder.mutation<ApiResponse<Order>, string>({
      query: (orderId) => ({
        url: `/orders/${orderId}/cancel`,
        method: 'POST',
      }),
      transformResponse: (response: any): ApiResponse<Order> => ({
        success: response.success,
        data: transformOrder(response.data),
        message: response.message,
      }),
      invalidatesTags: ['Order'],
    }),

    // Get user addresses
    getUserAddresses: builder.query<ApiResponse<Address[]>, void>({
      query: () => '/addresses',
      transformResponse: (response: any): ApiResponse<Address[]> => ({
        success: response.success,
        data: (response.data || []).map(transformAddress),
        message: response.message,
      }),
      providesTags: ['Address'],
    }),

    // Add new address
    addAddress: builder.mutation<ApiResponse<Address>, Omit<Address, 'id'>>({
      query: (addressData) => ({
        url: '/addresses',
        method: 'POST',
        body: {
          name: addressData.name,
          phone: addressData.phone,
          street: addressData.street,
          apartment: addressData.apartment,
          city: addressData.city,
          state: addressData.state,
          country: addressData.country,
          zipCode: addressData.zipCode,    // Changed from zip_code
          isDefault: addressData.isDefault, // Changed from is_default
        },
      }),
      transformResponse: (response: any): ApiResponse<Address> => ({
        success: response.success,
        data: transformAddress(response.data),
        message: response.message,
      }),
      invalidatesTags: ['Address'],
    }),

    // Update address
    updateAddress: builder.mutation<ApiResponse<Address>, Address>({
      query: (addressData) => ({
        url: `/addresses/${addressData.id}`,
        method: 'PUT',
        body: {
          name: addressData.name,
          phone: addressData.phone,
          street: addressData.street,
          apartment: addressData.apartment,
          city: addressData.city,
          state: addressData.state,
          country: addressData.country,
          zipCode: addressData.zipCode,    // Changed from zip_code
          isDefault: addressData.isDefault, // Changed from is_default
        },
      }),
      transformResponse: (response: any): ApiResponse<Address> => ({
        success: response.success,
        data: transformAddress(response.data),
        message: response.message,
      }),
      invalidatesTags: ['Address'],
    }),

    // Delete address
    deleteAddress: builder.mutation<ApiResponse<null>, number>({
      query: (addressId) => ({
        url: `/addresses/${addressId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Address'],
    }),

    // Set default address
    setDefaultAddress: builder.mutation<ApiResponse<Address>, number>({
      query: (addressId) => ({
        url: `/addresses/${addressId}/default`,
        method: 'PUT',
      }),
      transformResponse: (response: any): ApiResponse<Address> => ({
        success: response.success,
        data: transformAddress(response.data),
        message: response.message,
      }),
      invalidatesTags: ['Address'],
    }),

    // Get user payment methods (local storage for now - no backend endpoint)
    getUserPaymentMethods: builder.query<ApiResponse<PaymentMethod[]>, void>({
      queryFn: () => {
        // Payment methods are stored locally for now
        const stored = localStorage.getItem('paymentMethods');
        const paymentMethods = stored ? JSON.parse(stored) : [];
        return {
          data: {
            success: true,
            data: paymentMethods,
          },
        };
      },
      providesTags: ['PaymentMethod'],
    }),

    // Add payment method (local storage for now)
    addPaymentMethod: builder.mutation<ApiResponse<PaymentMethod>, Omit<PaymentMethod, 'id'>>({
      queryFn: (paymentData) => {
        const stored = localStorage.getItem('paymentMethods');
        const paymentMethods: PaymentMethod[] = stored ? JSON.parse(stored) : [];
        
        const newPayment: PaymentMethod = {
          ...paymentData,
          id: Date.now(),
        };
        
        // If this is default, unset others
        if (newPayment.isDefault) {
          paymentMethods.forEach(pm => pm.isDefault = false);
        }
        
        paymentMethods.push(newPayment);
        localStorage.setItem('paymentMethods', JSON.stringify(paymentMethods));
        
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

    // Delete payment method (local storage for now)
    deletePaymentMethod: builder.mutation<ApiResponse<null>, number>({
      queryFn: (paymentId) => {
        const stored = localStorage.getItem('paymentMethods');
        const paymentMethods: PaymentMethod[] = stored ? JSON.parse(stored) : [];
        
        const filtered = paymentMethods.filter(pm => pm.id !== paymentId);
        localStorage.setItem('paymentMethods', JSON.stringify(filtered));
        
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
      query: (formData) => ({
        url: '/contact',
        method: 'POST',
        body: formData,
      }),
      transformResponse: (response: any): ApiResponse<ContactMessage> => ({
        success: response.success,
        data: response.data,
        message: response.message || 'Message sent successfully! We will get back to you within 24 hours.',
      }),
    }),

    // Change user password
    changePassword: builder.mutation<ApiResponse<null>, { currentPassword: string; newPassword: string }>({
      query: (data) => ({
        url: '/auth/change-password',
        method: 'PUT',
        body: {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        },
      }),
      transformResponse: (response: any): ApiResponse<null> => ({
        success: response.success,
        data: null,
        message: response.message || 'Password changed successfully',
      }),
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
  useSetDefaultAddressMutation,
  useGetUserPaymentMethodsQuery,
  useAddPaymentMethodMutation,
  useDeletePaymentMethodMutation,
  useSubmitContactFormMutation,
  useChangePasswordMutation,
} = userApi;
