import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../redux/store';

// API base URL: uses environment variable in development, relative path in production
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Base API configuration for the live backend
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // Get token from auth state
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
    credentials: 'include',
  }),
  tagTypes: ['Product', 'Category', 'Review', 'User', 'Order', 'Address', 'PaymentMethod', 'Cart', 'Wishlist'],
  endpoints: () => ({}),
});

