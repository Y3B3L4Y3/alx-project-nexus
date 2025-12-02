import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';
import { productApi } from './productApi';
import type { UserRole } from '../redux/slices/authSlice';

// Types
export interface AdminUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  status: 'active' | 'suspended' | 'deleted';
  emailVerified: boolean;
  createdAt: string;
  totalOrders?: number;
  totalSpent?: number;
}

export interface AdminProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount: number;
  thumbnail: string;
  images?: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  categoryId?: number;
  categoryName?: string;
  brand?: string;
  tags?: string[];
  colors?: string[];
  sizes?: string[];
  isNew: boolean;
  isFeatured: boolean;
  status: 'active' | 'draft' | 'deleted';
  createdAt: string;
  updatedAt: string;
}

export interface AdminOrder {
  id: number;
  orderId: string;
  userId: number;
  customerName: string;
  customerEmail: string;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
  items?: {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
  }[];
}

export interface AdminCategory {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  parentId?: number;
  productCount: number;
  createdAt: string;
}

export interface AdminMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  pendingOrders: number;
  newOrdersToday: number;
  newUsersToday: number;
  newMessagesToday: number;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: string[];
  createdAt: string;
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  sort_order: number;
}

interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Transform functions
const transformUser = (user: any): AdminUser => ({
  id: user.id,
  email: user.email,
  firstName: user.first_name || user.firstName,
  lastName: user.last_name || user.lastName,
  phone: user.phone,
  avatar: user.avatar,
  role: user.role,
  status: user.status,
  emailVerified: Boolean(user.email_verified || user.emailVerified),
  createdAt: user.created_at || user.createdAt,
  totalOrders: user.total_orders || user.totalOrders,
  totalSpent: user.total_spent || user.totalSpent,
});

const transformProduct = (product: any): AdminProduct => ({
  id: product.id,
  name: product.name,
  slug: product.slug,
  description: product.description,
  price: parseFloat(product.price),
  originalPrice: product.original_price ? parseFloat(product.original_price) : undefined,
  discount: product.discount || 0,
  thumbnail: product.thumbnail,
  images: product.images || [],
  rating: parseFloat(product.rating) || 0,
  reviewCount: product.review_count || 0,
  stock: product.stock || 0,
  categoryId: product.category_id,
  categoryName: product.category_name,
  brand: product.brand,
  tags: product.tags || [],
  colors: product.colors || [],
  sizes: product.sizes || [],
  isNew: Boolean(product.is_new),
  isFeatured: Boolean(product.is_featured),
  status: product.status || 'active',
  createdAt: product.created_at,
  updatedAt: product.updated_at,
});

const transformOrder = (order: any): AdminOrder => ({
  id: order.id,
  orderId: order.order_id || order.orderId,
  userId: order.user_id || order.userId,
  customerName: order.customer_name || order.customerName || `${order.first_name || ''} ${order.last_name || ''}`.trim(),
  customerEmail: order.customer_email || order.customerEmail || order.email,
  subtotal: parseFloat(order.subtotal),
  shipping: parseFloat(order.shipping) || 0,
  tax: parseFloat(order.tax) || 0,
  discount: parseFloat(order.discount) || 0,
  total: parseFloat(order.total),
  status: order.status,
  paymentMethod: order.payment_method || order.paymentMethod,
  paymentStatus: order.payment_status || order.paymentStatus,
  trackingNumber: order.tracking_number || order.trackingNumber,
  estimatedDelivery: order.estimated_delivery || order.estimatedDelivery,
  createdAt: order.created_at || order.createdAt,
  items: order.items,
});

const transformCategory = (cat: any): AdminCategory => ({
  id: cat.id,
  name: cat.name,
  slug: cat.slug,
  icon: cat.icon,
  image: cat.image,
  parentId: cat.parent_id,
  productCount: cat.productCount || 0,
  createdAt: cat.created_at,
});

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['AdminProduct', 'AdminUser', 'AdminOrder', 'AdminCategory', 'AdminMessage', 'AdminStats', 'Role'],
  endpoints: (builder) => ({
    // Dashboard
    getDashboardStats: builder.query<ApiResponse<DashboardStats>, void>({
      query: () => '/admin/dashboard/stats',
      providesTags: ['AdminStats'],
    }),

    // Products
    getAdminProducts: builder.query<PaginatedResponse<AdminProduct>, { page?: number; limit?: number; search?: string; category?: string; status?: string }>({
      query: ({ page = 1, limit = 20, search, category, status }) => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('limit', String(limit));
        if (search) params.set('search', search);
        if (category) params.set('category', category);
        if (status) params.set('status', status);
        return `/products?${params.toString()}`;
      },
      transformResponse: (response: any): PaginatedResponse<AdminProduct> => ({
        success: true,
        data: (response.data || []).map(transformProduct),
        pagination: response.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 },
      }),
      providesTags: ['AdminProduct'],
    }),

    createProduct: builder.mutation<ApiResponse<AdminProduct>, Partial<AdminProduct>>({
      query: (product) => ({
        url: '/admin/products',
        method: 'POST',
        body: {
          name: product.name,
          description: product.description,
          price: product.price,
          originalPrice: product.originalPrice,
          discount: product.discount,
          thumbnail: product.thumbnail,
          stock: product.stock,
          categoryId: product.categoryId,
          brand: product.brand,
          tags: product.tags,
          colors: product.colors,
          sizes: product.sizes,
          isNew: product.isNew,
          isFeatured: product.isFeatured,
          status: product.status || 'active',
        },
      }),
      transformResponse: (response: any): ApiResponse<AdminProduct> => ({
        success: response.success,
        data: transformProduct(response.data),
        message: response.message,
      }),
      invalidatesTags: ['AdminProduct', 'AdminStats'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Also invalidate public product cache
          dispatch(productApi.util.invalidateTags(['Product']));
        } catch {
          // Ignore errors
        }
      },
    }),

    updateProduct: builder.mutation<ApiResponse<AdminProduct>, { id: number; data: Partial<AdminProduct> }>({
      query: ({ id, data }) => ({
        url: `/admin/products/${id}`,
        method: 'PUT',
        body: {
          name: data.name,
          description: data.description,
          price: data.price,
          originalPrice: data.originalPrice,
          discount: data.discount,
          thumbnail: data.thumbnail,
          stock: data.stock,
          categoryId: data.categoryId,
          brand: data.brand,
          tags: data.tags,
          colors: data.colors,
          sizes: data.sizes,
          isNew: data.isNew,
          isFeatured: data.isFeatured,
          status: data.status,
        },
      }),
      transformResponse: (response: any): ApiResponse<AdminProduct> => ({
        success: response.success,
        data: transformProduct(response.data),
        message: response.message,
      }),
      invalidatesTags: ['AdminProduct'],
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Also invalidate public product cache
          dispatch(productApi.util.invalidateTags(['Product', { type: 'Product', id }]));
        } catch {
          // Ignore errors
        }
      },
    }),

    deleteProduct: builder.mutation<ApiResponse<null>, number>({
      query: (id) => ({
        url: `/admin/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AdminProduct', 'AdminStats'],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Also invalidate public product cache
          dispatch(productApi.util.invalidateTags(['Product', { type: 'Product', id }]));
        } catch {
          // Ignore errors
        }
      },
    }),

    // Product Images
    getProductImages: builder.query<ApiResponse<ProductImage[]>, number>({
      query: (productId) => `/admin/products/${productId}/images`,
      transformResponse: (response: any): ApiResponse<ProductImage[]> => ({
        success: true,
        data: response.data || [],
      }),
      providesTags: (_result, _error, productId) => [{ type: 'AdminProduct', id: productId }],
    }),

    uploadProductImages: builder.mutation<ApiResponse<{ imageUrls: string[] }>, { productId: number; images: FormData }>({
      query: ({ productId, images }) => ({
        url: `/admin/products/${productId}/images`,
        method: 'POST',
        body: images,
        formData: true,
      }),
      invalidatesTags: (_result, _error, { productId }) => [{ type: 'AdminProduct', id: productId }],
      async onQueryStarted({ productId }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(productApi.util.invalidateTags(['Product', { type: 'Product', id: productId }]));
        } catch {
          // Ignore errors
        }
      },
    }),

    deleteProductImage: builder.mutation<ApiResponse<null>, { productId: number; imageId: number }>({
      query: ({ imageId }) => ({
        url: `/admin/products/0/images/${imageId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { productId }) => [{ type: 'AdminProduct', id: productId }],
      async onQueryStarted({ productId }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(productApi.util.invalidateTags(['Product', { type: 'Product', id: productId }]));
        } catch {
          // Ignore errors
        }
      },
    }),

    // Categories
    getAdminCategories: builder.query<ApiResponse<AdminCategory[]>, void>({
      query: () => '/categories',
      transformResponse: (response: any): ApiResponse<AdminCategory[]> => ({
        success: true,
        data: (response.data || []).map(transformCategory),
      }),
      providesTags: ['AdminCategory'],
    }),

    createCategory: builder.mutation<ApiResponse<AdminCategory>, Partial<AdminCategory>>({
      query: (category) => ({
        url: '/admin/categories',
        method: 'POST',
        body: {
          name: category.name,
          slug: category.slug,
          icon: category.icon,
          image: category.image,
          parentId: category.parentId,
        },
      }),
      invalidatesTags: ['AdminCategory'],
    }),

    updateCategory: builder.mutation<ApiResponse<AdminCategory>, { id: number; data: Partial<AdminCategory> }>({
      query: ({ id, data }) => ({
        url: `/admin/categories/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['AdminCategory'],
    }),

    deleteCategory: builder.mutation<ApiResponse<null>, number>({
      query: (id) => ({
        url: `/admin/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AdminCategory'],
    }),

    // Orders
    getAdminOrders: builder.query<PaginatedResponse<AdminOrder>, { page?: number; limit?: number; status?: string }>({
      query: ({ page = 1, limit = 20, status }) => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('limit', String(limit));
        if (status) params.set('status', status);
        return `/admin/orders?${params.toString()}`;
      },
      transformResponse: (response: any): PaginatedResponse<AdminOrder> => ({
        success: true,
        data: (response.data || []).map(transformOrder),
        pagination: response.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 },
      }),
      providesTags: ['AdminOrder'],
    }),

    updateOrderStatus: builder.mutation<ApiResponse<AdminOrder>, { id: number; status: string }>({
      query: ({ id, status }) => ({
        url: `/admin/orders/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['AdminOrder', 'AdminStats'],
    }),

    updateOrderTracking: builder.mutation<ApiResponse<AdminOrder>, { id: number; trackingNumber: string; estimatedDelivery?: string }>({
      query: ({ id, trackingNumber, estimatedDelivery }) => ({
        url: `/admin/orders/${id}/tracking`,
        method: 'PUT',
        body: { trackingNumber, estimatedDelivery },
      }),
      invalidatesTags: ['AdminOrder'],
    }),

    // Users
    getAdminUsers: builder.query<PaginatedResponse<AdminUser>, { page?: number; limit?: number; search?: string; role?: string }>({
      query: ({ page = 1, limit = 20, search, role }) => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('limit', String(limit));
        if (search) params.set('search', search);
        if (role) params.set('role', role);
        return `/admin/users?${params.toString()}`;
      },
      transformResponse: (response: any): PaginatedResponse<AdminUser> => ({
        success: true,
        data: (response.data || []).map(transformUser),
        pagination: response.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 },
      }),
      providesTags: ['AdminUser'],
    }),

    createUser: builder.mutation<ApiResponse<AdminUser>, { email: string; password: string; firstName: string; lastName: string; phone?: string; role?: string }>({
      query: (userData) => ({
        url: '/admin/users',
        method: 'POST',
        body: userData,
      }),
      transformResponse: (response: any): ApiResponse<AdminUser> => ({
        success: response.success,
        data: transformUser(response.data),
        message: response.message,
      }),
      invalidatesTags: ['AdminUser', 'AdminStats'],
    }),

    updateUser: builder.mutation<ApiResponse<AdminUser>, { id: number; data: { email?: string; firstName?: string; lastName?: string; phone?: string } }>({
      query: ({ id, data }) => ({
        url: `/admin/users/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: any): ApiResponse<AdminUser> => ({
        success: response.success,
        data: transformUser(response.data),
        message: response.message,
      }),
      invalidatesTags: ['AdminUser'],
    }),

    updateUserStatus: builder.mutation<ApiResponse<AdminUser>, { id: number; status: string }>({
      query: ({ id, status }) => ({
        url: `/admin/users/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['AdminUser'],
    }),

    updateUserRole: builder.mutation<ApiResponse<AdminUser>, { id: number; role: string }>({
      query: ({ id, role }) => ({
        url: `/admin/users/${id}/role`,
        method: 'PUT',
        body: { role },
      }),
      invalidatesTags: ['AdminUser'],
    }),

    updateUserPassword: builder.mutation<ApiResponse<null>, { id: number; newPassword: string }>({
      query: ({ id, newPassword }) => ({
        url: `/admin/users/${id}/password`,
        method: 'PUT',
        body: { newPassword },
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'AdminUser', id }],
    }),

    // Messages
    getAdminMessages: builder.query<PaginatedResponse<AdminMessage>, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 20 }) => `/admin/messages?page=${page}&limit=${limit}`,
      transformResponse: (response: any): PaginatedResponse<AdminMessage> => ({
        success: true,
        data: response.data || [],
        pagination: response.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 },
      }),
      providesTags: ['AdminMessage'],
    }),

    updateMessageStatus: builder.mutation<ApiResponse<null>, { id: number; status: string }>({
      query: ({ id, status }) => ({
        url: `/admin/messages/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['AdminMessage'],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetAdminProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductImagesQuery,
  useUploadProductImagesMutation,
  useDeleteProductImageMutation,
  useGetAdminCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetAdminOrdersQuery,
  useUpdateOrderStatusMutation,
  useUpdateOrderTrackingMutation,
  useGetAdminUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useUpdateUserStatusMutation,
  useUpdateUserRoleMutation,
  useUpdateUserPasswordMutation,
  useGetAdminMessagesQuery,
  useUpdateMessageStatusMutation,
} = adminApi;

