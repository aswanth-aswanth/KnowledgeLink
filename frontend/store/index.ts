// store/index.ts
import { configureStore, combineReducers, Action, ThunkAction } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import localForage from 'localforage';

import topicsReducer from './topicsSlice';
import darkmodeReducer from './darkmodeSlice';
// Import authReducer separately
import { authReducer } from './authSlice';
import socketReducer from './socketSlice';

const createNoopStorage = () => ({
  getItem: () => Promise.resolve(null),
  setItem: (_key: any, value: any) => Promise.resolve(value),
  removeItem: () => Promise.resolve(),
});

const storage = typeof window !== 'undefined'
  ? localForage
  : createNoopStorage();

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'darkmode', 'topics'],
};

const rootReducer = combineReducers({
  topics: topicsReducer,
  auth: authReducer,
  darkmode: darkmodeReducer,
  socket: socketReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType,
  RootState,
  unknown,
  Action<string>
>;
