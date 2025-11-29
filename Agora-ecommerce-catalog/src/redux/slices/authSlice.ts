import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
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

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      saveAuthState(state);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      saveAuthState(state);
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        saveAuthState(state);
      }
    },
  },
});

export const { login, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;

