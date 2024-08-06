import apiClient from '../apiClient';

export const fetchUserChat = async () => {
    const response = await apiClient('/chat/user/chats');
    return response.data;
};
