import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/api/apiClient';
import { getContributors } from '@/api';

export interface Contributor {
  _id: string;
  username: string;
  email: string;
  image?: string;
}

interface Article {
  name: string;
  question: string;
  content: string;
  author: string;
  date: string;
}

interface HomeState {
  contributors: Contributor[];
  isContributorsLoading: boolean;
  contributorsError: string | null;
  trendingArticles: Article[];
  isLoadingTrendingArticles: boolean;
}

const initialState: HomeState = {
  contributors: [],
  isContributorsLoading: false,
  contributorsError: null,
  trendingArticles: [],
  isLoadingTrendingArticles: false,
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

export const fetchTrendingArticles = createAsyncThunk(
  'home/fetchTrendingArticles',
  async (count: number) => {
    const res = await apiClient.get(
      `/recommendation/random-topics?count=${count}`
    );
    return res.data as Article[];
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
      })
      .addCase(fetchTrendingArticles.pending, (state) => {
        state.isLoadingTrendingArticles = true;
      })
      .addCase(fetchTrendingArticles.fulfilled, (state, action) => {
        state.trendingArticles = action.payload;
        state.isLoadingTrendingArticles = false;
      })
      .addCase(fetchTrendingArticles.rejected, (state) => {
        state.isLoadingTrendingArticles = false;
      });
  },
});

export const homeReducer = homeSlice.reducer;
