import apiClient from '../apiClient';

export const fetchChatMessages = async (selectedChatId: string) => {
    const response = await apiClient(`/chat/${selectedChatId}/messages`);
    return response.data;
};
