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
