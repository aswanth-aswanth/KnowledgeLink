import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { NextRouter } from 'next/router';
import { getFromLocalStorage, removeFromLocalStorage } from '@/lib/utils';
import { isTokenExpired } from '@/lib/auth';
import { logout, register, updateUserApi } from '@/api';
import { RegistrationFormData } from '@/lib/validation/registration.validation';
import toast from 'react-hot-toast';

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
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (
    {
      formData,
      router,
    }: { formData: RegistrationFormData; router?: NextRouter },
    { rejectWithValue }
  ) => {
    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      toast('Registration is successful');
      if (router) {
        router.push('/sign-in');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data?.error || 'Registration failed'
        );
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await updateUserApi(formData, {
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
      state.isLoading = false;
      state.error = null;
    },
    clearAuthState: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.isLoading = false;
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setAuthState, clearAuthState, updateUser } = authSlice.actions;
export const authReducer = authSlice.reducer;

export const selectAuthState = (state: { auth: AuthState }) => state.auth;
