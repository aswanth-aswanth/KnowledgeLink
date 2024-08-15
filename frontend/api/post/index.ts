import apiClient from '../apiClient';

export const getPosts = async () => {
    const response = await apiClient("/post/posts");
    return response.data;
};

export const addLike = async (postId: string) => {
    const response = await apiClient.put(`/post/like/${postId}`);
    return response.data;
};

export const addComment = async (postId: string, comment: string) => {
    const response = await apiClient.post(`/post/comment/${postId}`, {
        text: comment,
    });
    return response.data;
};

export const savePost = async (postId: string) => {
    const response = await apiClient.post('/profile/save-post', { postId });
    return response.data;
};