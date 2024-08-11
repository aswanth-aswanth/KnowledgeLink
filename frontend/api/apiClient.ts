import axios from 'axios';
import requestInterceptor from './interceptors/requestInterceptor';
import responseInterceptor from './interceptors/responseInterceptor';
import errorInterceptor from './interceptors/errorInterceptor';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(requestInterceptor);
apiClient.interceptors.response.use(responseInterceptor, errorInterceptor);

export default apiClient;
