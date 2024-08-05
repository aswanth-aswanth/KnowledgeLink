import apiClient from './apiClient';

export const getNotifications = async () => {
    try {
        const response = await apiClient(`/notification`);
        console.log("notifications : ", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching notifications : ", error);
        throw error;
    }
};
export const getNotificationCount = async () => {
    try {
        const response = await apiClient(`/notification/count`);
        return response.data;
    } catch (error) {
        console.error("Error fetching notification count : ", error);
        throw error;
    }
};

export const markNotificationsAsRead = async (ids: string[]) => {
    try {
        console.log("mark as read : ", ids);
        const response = await apiClient.patch('/notification/mark-read', { notificationIds: ids });
        return response.data;
    } catch (error) {
        console.error("Error mark as read : ", error);
        throw error;
    }
};