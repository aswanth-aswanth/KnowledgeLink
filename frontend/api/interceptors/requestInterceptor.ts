import { AxiosRequestConfig } from 'axios';
import { store } from '@/store';

const requestInterceptor = (config: AxiosRequestConfig) => {
  const state = store.getState();
  const token = state.auth.token;

  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
};

export default requestInterceptor;