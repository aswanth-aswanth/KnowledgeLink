import { RootState } from '@/store';

export const selectContributors = (state: RootState) => state.home.contributors;
export const selectContributorsLoading = (state: RootState) =>
  state.home.isContributorsLoading;
export const selectContributorsError = (state: RootState) =>
  state.home.contributorsError;
