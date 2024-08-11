import apiClient from './apiClient';

export const getUserProfile = async (userId: string) => {
    try {
        const response = await apiClient(`/profile/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
};

export const followUser = async (userId: string) => {
    try {
        const response = await apiClient.patch(`/profile/user/${userId}/follow`);
        return response.data;
    } catch (error) {
        console.error("Error following user:", error);
        throw error;
    }
};

export const getFollowers = async (userId: string) => {
    const response = await apiClient.get(`/profile/user/${userId}/followers`);
    return response.data;
};

export const getFollowings = async (userId: string) => {
    const response = await apiClient.get(`/profile/user/${userId}/followings`);
    return response.data;
};