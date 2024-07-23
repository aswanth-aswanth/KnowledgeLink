// store/authSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import { isTokenExpired } from '@/utils/auth';
import apiClient from '@/api/apiClient';

// Define types
export interface User {
  id: string;
  name: string;
  email: string;
  imageUrl?: string;
  bio?: string; 
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

// Async thunk
export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch('/profile/user', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice
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
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    },
    checkTokenExpiration: (state) => {
      if (typeof window !== 'undefined') {
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
      }
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateUserProfile.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

// Export actions and reducer
export const { setAuthState, clearAuthState, checkTokenExpiration, updateUser } = authSlice.actions;
export const authReducer = authSlice.reducer;

// Selector
export const selectAuthState = (state: { auth: AuthState }) => state.auth;