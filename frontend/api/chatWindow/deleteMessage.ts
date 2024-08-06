import apiClient from '../apiClient';

export const deleteMessage = async (selectedChatId: string, messageId: string) => {
    const response = await apiClient.delete(`/chat/${selectedChatId}/message/${messageId}`);
    return response.data;
};
