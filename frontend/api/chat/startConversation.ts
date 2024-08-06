import apiClient from '../apiClient';

export const startConversation = async (participantId: string) => {
    const response = await apiClient.post("/chat/individual", { participantId });
    return response.data;
};
