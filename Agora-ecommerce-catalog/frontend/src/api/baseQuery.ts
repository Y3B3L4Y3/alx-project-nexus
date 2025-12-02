import { fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { Mutex } from 'async-mutex';
import type { RootState } from '../redux/store';
import { setTokens, logout } from '../redux/slices/authSlice';

const mutex = new Mutex();

// API base URL: uses environment variable in development, backend server URL as fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
  credentials: 'include',
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Wait until the mutex is available without locking it
  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Check if we're not already refreshing
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        const state = api.getState() as RootState;
        const refreshToken = state.auth.refreshToken;

        if (refreshToken) {
          // Try to get a new token
          const refreshResult = await baseQuery(
            {
              url: '/auth/refresh',
              method: 'POST',
              body: { refreshToken },
            },
            api,
            extraOptions
          );

          if (refreshResult.data) {
            const data = refreshResult.data as {
              success: boolean;
              data: {
                accessToken: string;
                refreshToken?: string;
              };
            };

            if (data.success && data.data.accessToken) {
              // Store the new tokens
              api.dispatch(
                setTokens({
                  accessToken: data.data.accessToken,
                  refreshToken: data.data.refreshToken || refreshToken,
                })
              );

              // Retry the original query with new token
              result = await baseQuery(args, api, extraOptions);
            } else {
              // Token refresh failed, logout the user
              api.dispatch(logout());
            }
          } else {
            // Token refresh failed, logout the user
            api.dispatch(logout());
          }
        } else {
          // No refresh token available, logout
          api.dispatch(logout());
        }
      } finally {
        release();
      }
    } else {
      // Wait for the ongoing token refresh to complete
      await mutex.waitForUnlock();
      // Retry the query after the refresh
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

