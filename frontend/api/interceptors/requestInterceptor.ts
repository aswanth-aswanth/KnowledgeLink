import { InternalAxiosRequestConfig } from 'axios';
import { getFromLocalStorage } from '@/lib/utils';

const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  const token = getFromLocalStorage('token');

  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
};

export default requestInterceptor;
