import apiClient from './apiClient';

export const getUserPosts = async (userId: string) => {
    try {
        const response = await apiClient(`/posts/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user posts:", error);
        throw error;
    }
};