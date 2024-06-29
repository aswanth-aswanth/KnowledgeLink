// store/index.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import topicsReducer from './topicsSlice';
import authReducer from './authSlice';
import darkmodeReducer from './darkmodeSlice';

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
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;