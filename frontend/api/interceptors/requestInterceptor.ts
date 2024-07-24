import { AxiosRequestConfig } from 'axios';

const requestInterceptor = (config: AxiosRequestConfig) => {
  const token = localStorage.getItem('token');;

  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
};

export default requestInterceptor;