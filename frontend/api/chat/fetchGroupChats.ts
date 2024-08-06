import apiClient from '../apiClient';

export const fetchGroupChats = async () => {
    const response = await apiClient("/chat/user/group-chats");
    return response.data;
};
