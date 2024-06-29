// store/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import { RootState } from './index';
import { isTokenExpired } from '@/utils/auth';

interface User {
  id: string;
  name: string;
  email: string;
  imageUrl?: string; // Add imageUrl field for storing user image
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState: (state, action: PayloadAction<{ isAuthenticated: boolean; user: User; token: string }>) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    clearAuthState: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
    checkTokenExpiration: (state) => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        if (isTokenExpired(storedToken)) {
          localStorage.removeItem('token');
          state.isAuthenticated = false;
          state.user = null;
          state.token = null;
        } else {
          const decoded = jwtDecode<{ id: string; username: string; email: string; image?: string }>(storedToken);
          state.isAuthenticated = true;
          state.user = {
            id: decoded.id,
            name: decoded.username,
            email: decoded.email,
            imageUrl: decoded.image,
          };
          state.token = storedToken;
        }
      } else {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      }
    },
  },
});

export const { setAuthState, clearAuthState, checkTokenExpiration } = authSlice.actions;

export const selectAuthState = (state: RootState) => state.auth;

export default authSlice.reducer;
