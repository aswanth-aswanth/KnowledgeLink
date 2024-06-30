import { AxiosRequestConfig } from 'axios';
import { store } from '@/store';

export const requestInterceptor = (config: AxiosRequestConfig) => {
    const state = store.getState();
    const token = state.auth.token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
};
