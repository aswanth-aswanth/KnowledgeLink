// store/index.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import createIndexedDBStorage from 'redux-persist-indexeddb-storage';
import topicsReducer from './topicsSlice';
import authReducer from './authSlice';
import darkmodeReducer from './darkmodeSlice';
import editorReducer from './editorSlice';

const createNoopStorage = () => {
  return {
    getItem(_key: any) {
      return Promise.resolve(null);
    },
    setItem(_key: any, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: any) {
      return Promise.resolve();
    },
  };
};

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
  editor: editorReducer,
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