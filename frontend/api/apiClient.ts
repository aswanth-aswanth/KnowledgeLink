import axios from 'axios';
import { requestInterceptor } from './interceptors/requestInterceptor';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(requestInterceptor);

export default apiClient;
