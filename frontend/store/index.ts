// store/index.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import createIndexedDBStorage from 'redux-persist-indexeddb-storage';

import topicsReducer from './topicsSlice';
import darkmodeReducer from './darkmodeSlice';
// Import authReducer separately
import { authReducer } from './authSlice';

const createNoopStorage = () => ({
  getItem: () => Promise.resolve(null),
  setItem: (_key: any, value: any) => Promise.resolve(value),
  removeItem: () => Promise.resolve(),
});

const storage = typeof window !== 'undefined'
  ? createIndexedDBStorage('roadmap')
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