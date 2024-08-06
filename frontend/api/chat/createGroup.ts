import apiClient from '../apiClient';

export const createGroup = async (name: string, participantIds: string[]) => {
    const response = await apiClient.post("/chat/group", { name, participantIds });
    return response.data;
};
