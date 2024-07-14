import apiClient from './apiClient';

export const getNotifications = async () => {
    try {
        const response = await apiClient(`/notification`);
        return response.data;
    } catch (error) {
        console.error("Error fetching notifications : ", error);
        throw error;
    }
};