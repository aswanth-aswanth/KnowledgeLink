import apiClient from '../apiClient';
import { LoginData } from '@/types/auth';

export const login = async (data: LoginData) => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
};
