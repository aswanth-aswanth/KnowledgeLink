import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/api/apiClient';
import { getContributors } from '@/api';

export interface Contributor {
  _id: string;
  username: string;
  email: string;
  image?: string;
}

interface HomeState {
  contributors: Contributor[];
  isContributorsLoading: boolean;
  contributorsError: string | null;
}

const initialState: HomeState = {
  contributors: [],
  isContributorsLoading: false,
  contributorsError: null,
};

export const fetchContributors = createAsyncThunk(
  'home/fetchContributors',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getContributors();
      return res;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch contributors');
    }
  }
);

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContributors.pending, (state) => {
        state.isContributorsLoading = true;
        state.contributorsError = null;
      })
      .addCase(fetchContributors.fulfilled, (state, action) => {
        state.contributors = action.payload;
        state.isContributorsLoading = false;
      })
      .addCase(fetchContributors.rejected, (state, action) => {
        state.contributorsError = action.payload as string;
        state.isContributorsLoading = false;
      });
  },
});

export const homeReducer = homeSlice.reducer;
