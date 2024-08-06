import apiClient from '../apiClient';

export const getSearchUsers = async (term: string) => {
    const response = await apiClient(`/profile/search?name=${term}`);
    return response.data;
};
