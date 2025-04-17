import { RootState } from '@/redux';

export const selectContributors = (state: RootState) => state.home.contributors;
export const selectContributorsLoading = (state: RootState) =>
  state.home.isContributorsLoading;
export const selectContributorsError = (state: RootState) =>
  state.home.contributorsError;
export const selectTrendingArticles = (state: RootState) =>
  state.home.trendingArticles;
export const selectIsLoadingTrendingArticles = (state: RootState) =>
  state.home.isLoadingTrendingArticles;
export const selectRoadmapData = (state: RootState) => state.home.roadmapData;
export const selectIsLoadingRoadmapData = (state: RootState) =>
  state.home.isLoadingRoadmapData;
