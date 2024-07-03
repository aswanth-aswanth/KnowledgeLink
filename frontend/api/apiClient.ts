import axios from 'axios';
import { refreshAccessToken } from '@/utils/auth';
import { isTokenExpired } from '@/utils/auth';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      if (isTokenExpired(token)) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          config.headers.Authorization = `Bearer ${newToken}`;
        } else {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
