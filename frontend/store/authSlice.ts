import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import apiClient from '@/api/apiClient';
import axios from 'axios';
import { getFromLocalStorage, removeFromLocalStorage } from '@/lib/utils';
import { isTokenExpired } from '@/lib/auth';
import { logout } from '@/api';

export interface User {
  id: string;
  userId?: string;
  name: string;
  email: string;
  imageUrl?: string;
  bio?: string;
  role?: string;
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

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch('/profile/user', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const checkTokenExpiration = createAsyncThunk(
  'auth/checkTokenExpiration',
  async (_, { dispatch }) => {
    if (typeof window === 'undefined') return;

    const storedToken = getFromLocalStorage('token');
    console.log('storedToken : ', storedToken);
    console.log('isTokenExpired(storedToken) : ', isTokenExpired(storedToken));
    if (!storedToken || isTokenExpired(storedToken)) {
      removeFromLocalStorage('token');
      dispatch(clearAuthState());
      return;
    }

    const decoded = jwtDecode<{
      id: string;
      username: string;
      email: string;
      image?: string;
      role?: string;
    }>(storedToken);

    dispatch(
      setAuthState({
        isAuthenticated: true,
        token: storedToken,
        user: {
          id: decoded.id,
          name: decoded.username,
          email: decoded.email,
          imageUrl: decoded.image,
          role: decoded.role,
        },
      })
    );
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await logout();
      removeFromLocalStorage('token');
      dispatch(clearAuthState());
    } catch (error) {
      console.error('Logout failed:', error);
      return rejectWithValue('Logout failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState: (
      state,
      action: PayloadAction<{
        isAuthenticated: boolean;
        user: User;
        token: string;
      }>
    ) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    clearAuthState: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
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

export const { setAuthState, clearAuthState, updateUser } = authSlice.actions;
export const authReducer = authSlice.reducer;

export const selectAuthState = (state: { auth: AuthState }) => state.auth;
