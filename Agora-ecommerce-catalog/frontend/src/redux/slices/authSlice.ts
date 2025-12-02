import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// All possible user roles matching backend
export type UserRole = 'customer' | 'admin' | 'moderator' | 'editor' | 'viewer' | 'super_admin';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  name: string; // Computed: firstName + lastName
  phone?: string;
  avatar?: string;
  role: UserRole;
  createdAt?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  refreshToken: string | null;
}

// Load initial state from localStorage
const loadAuthState = (): AuthState => {
  try {
    const serializedState = localStorage.getItem('authState');
    if (serializedState) {
      return JSON.parse(serializedState);
    }
  } catch (err) {
    console.error('Error loading auth state:', err);
  }
  return {
    isAuthenticated: false,
    user: null,
    token: null,
    refreshToken: null,
  };
};

// Save state to localStorage
const saveAuthState = (state: AuthState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('authState', serializedState);
  } catch (err) {
    console.error('Error saving auth state:', err);
  }
};

const initialState: AuthState = loadAuthState();

interface LoginPayload {
  user: User;
  accessToken: string;
  refreshToken: string;
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<LoginPayload>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      saveAuthState(state);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      saveAuthState(state);
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        saveAuthState(state);
      }
    },
    setTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken?: string }>) => {
      state.token = action.payload.accessToken;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
      saveAuthState(state);
    },
  },
});

export const { login, logout, updateUser, setTokens } = authSlice.actions;
export default authSlice.reducer;
