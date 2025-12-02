import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { ApiResponse } from './types';
import type { UserRole } from '../redux/slices/authSlice';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  createdAt?: string;
}

interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api',
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    // User login
    login: builder.mutation<ApiResponse<AuthResponse>, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: any): ApiResponse<AuthResponse> => {
        const user = response.data?.user;
        return {
          success: response.success,
          data: {
            user: {
              id: user.id,
              email: user.email,
              firstName: user.first_name || user.firstName,
              lastName: user.last_name || user.lastName,
              name: `${user.first_name || user.firstName} ${user.last_name || user.lastName}`,
              phone: user.phone,
              avatar: user.avatar,
              role: user.role,
            },
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
          },
          message: response.message,
        };
      },
    }),

    // User registration
    register: builder.mutation<ApiResponse<AuthResponse>, RegisterRequest>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: {
          email: userData.email,
          password: userData.password,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
        },
      }),
      transformResponse: (response: any): ApiResponse<AuthResponse> => {
        const user = response.data?.user;
        return {
          success: response.success,
          data: {
            user: {
              id: user.id,
              email: user.email,
              firstName: user.first_name || user.firstName,
              lastName: user.last_name || user.lastName,
              name: `${user.first_name || user.firstName} ${user.last_name || user.lastName}`,
              phone: user.phone,
              avatar: user.avatar,
              role: user.role,
            },
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
          },
          message: response.message,
        };
      },
    }),

    // Admin login
    adminLogin: builder.mutation<ApiResponse<AuthResponse>, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/admin/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: any): ApiResponse<AuthResponse> => {
        const user = response.data?.user;
        return {
          success: response.success,
          data: {
            user: {
              id: user.id,
              email: user.email,
              firstName: user.first_name || user.firstName,
              lastName: user.last_name || user.lastName,
              name: `${user.first_name || user.firstName} ${user.last_name || user.lastName}`,
              phone: user.phone,
              avatar: user.avatar,
              role: user.role,
            },
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
          },
          message: response.message,
        };
      },
    }),

    // Logout
    logout: builder.mutation<ApiResponse<null>, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),

    // Refresh token
    refreshToken: builder.mutation<ApiResponse<{ accessToken: string; refreshToken?: string }>, string>({
      query: (refreshToken) => ({
        url: '/auth/refresh',
        method: 'POST',
        body: { refreshToken },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useAdminLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
} = authApi;

