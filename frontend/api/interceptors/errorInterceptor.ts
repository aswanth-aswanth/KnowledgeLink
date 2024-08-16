import { AxiosError, InternalAxiosRequestConfig } from "axios";
import { refreshToken } from "../auth";
import apiClient from "../apiClient";

// Extend the InternalAxiosRequestConfig type with a _retry property
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

const errorInterceptor = async (error: AxiosError) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;

    if (originalRequest && error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
            const { token } = await refreshToken();
            localStorage.setItem('token', token);
            if (originalRequest.headers) {
                originalRequest.headers['Authorization'] = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
        } catch (refreshError) {
            return Promise.reject(refreshError);
        }
    }
    return Promise.reject(error);
};

export default errorInterceptor;
