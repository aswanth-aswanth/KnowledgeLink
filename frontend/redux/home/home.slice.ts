import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getContributors, getRandomTopics, getRoadmapsByType } from '@/api';

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

interface Roadmap {
  _id: string;
  title: string;
  description: string;
  likes: number;
}

interface HomeState {
  contributors: Contributor[];
  isContributorsLoading: boolean;
  contributorsError: string | null;
  trendingArticles: Article[];
  isLoadingTrendingArticles: boolean;
  roadmapData: Roadmap[];
  isLoadingRoadmapData: boolean;
}

const initialState: HomeState = {
  contributors: [],
  isContributorsLoading: false,
  contributorsError: null,
  trendingArticles: [],
  isLoadingTrendingArticles: false,
  roadmapData: [],
  isLoadingRoadmapData: false,
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
    const res = await getRandomTopics(count);
    return res as Article[];
  }
);

export const fetchRoadmapsByType = createAsyncThunk(
  'home/fetchRoadmapsByType',
  async (type: string) => {
    const res = await getRoadmapsByType(type);
    return res as Roadmap[];
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
        state.contributors = action.payload?.users;
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
      })
      .addCase(fetchRoadmapsByType.pending, (state) => {
        state.isLoadingRoadmapData = true;
      })
      .addCase(fetchRoadmapsByType.fulfilled, (state, action) => {
        state.roadmapData = action.payload;
        state.isLoadingRoadmapData = false;
      })
      .addCase(fetchRoadmapsByType.rejected, (state) => {
        state.isLoadingRoadmapData = false;
      });
  },
});

export const homeReducer = homeSlice.reducer;
