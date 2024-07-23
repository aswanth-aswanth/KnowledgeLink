// store/selectors.ts
import { RootState } from './index';

export const selectAuthState = (state: RootState) => state.auth;