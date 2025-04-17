import apiClient from './apiClient';
import { LoginData } from '@/types/auth';

export const login = async (data: LoginData) => {
  try {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  } catch (e) {
    const error = e as Error;
    console.error('Error in login api:', error.message);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  } catch (e) {
    const error = e as Error;
    console.error('Error in logout api:', error.message);
    throw error;
  }
};

export const register = async (payload: {
  username: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await apiClient.post('/auth/register', payload);
    return response.data;
  } catch (e) {
    const error = e as Error;
    console.error('Error in logout api:', error.message);
    throw error;
  }
};

export const refreshToken = async () => {
  try {
    const response = await apiClient.post('/auth/refresh-token');
    return response.data;
  } catch (e) {
    const error = e as Error;
    console.error('Error in refreshToken api:', error.message);
    throw error;
  }
};

export const createGroup = async (name: string, participantIds: string[]) => {
  try {
    const response = await apiClient.post('/chat/group', {
      name,
      participantIds,
    });
    return response.data;
  } catch (e) {
    const error = e as Error;
    console.error('Error in createGroup api:', error.message);
    throw error;
  }
};

export const fetchGroupChats = async () => {
  try {
    const response = await apiClient('/chat/user/group-chats');
    return response.data;
  } catch (e) {
    const error = e as Error;
    console.error('Error in fetchGroupChats api:', error.message);
    throw error;
  }
};

export const fetchUserChat = async () => {
  try {
    const response = await apiClient('/chat/user/chats');
    return response.data;
  } catch (e) {
    const error = e as Error;
    console.error('Error in fetchUserChat api:', error.message);
    throw error;
  }
};

export const getSearchUsers = async (term: string) => {
  try {
    const response = await apiClient(`/profile/search?name=${term}`);
    return response.data;
  } catch (e) {
    const error = e as Error;
    console.error('Error in getSearchUsers api:', error.message);
    throw error;
  }
};

export const startConversation = async (participantId: string) => {
  try {
    const response = await apiClient.post('/chat/individual', {
      participantId,
    });
    return response.data;
  } catch (e) {
    const error = e as Error;
    console.error('Error in startConversation api:', error.message);
    throw error;
  }
};

export const deleteMessage = async (
  selectedChatId: string,
  messageId: string
) => {
  try {
    const response = await apiClient.delete(
      `/chat/${selectedChatId}/message/${messageId}`
    );
    return response.data;
  } catch (e) {
    const error = e as Error;
    console.error('Error in deleteMessage api:', error.message);
    throw error;
  }
};

export const fetchChatMessages = async (selectedChatId: string) => {
  try {
    const response = await apiClient(`/chat/${selectedChatId}/messages`);
    return response.data;
  } catch (e) {
    const error = e as Error;
    console.error('Error in fetchChatMessages api:', error.message);
    throw error;
  }
};

export const getPosts = async () => {
  try {
    const response = await apiClient('/post/posts');
    return response.data;
  } catch (e) {
    const error = e as Error;
    console.error('Error in getPosts api:', error.message);
    throw error;
  }
};

export const addLike = async (postId: string) => {
  try {
    const response = await apiClient.put(`/post/like/${postId}`);
    return response.data;
  } catch (e) {
    const error = e as Error;
    console.error('Error in addLike api:', error.message);
    throw error;
  }
};

export const addComment = async (postId: string, comment: string) => {
  try {
    const response = await apiClient.post(`/post/comment/${postId}`, {
      text: comment,
    });
    return response.data;
  } catch (e) {
    const error = e as Error;
    console.error('Error in addComment api:', error.message);
    throw error;
  }
};

export const savePost = async (postId: string) => {
  try {
    const response = await apiClient.post('/profile/save-post', { postId });
    return response.data;
  } catch (e) {
    const error = e as Error;
    console.error('Error in savePost api:', error.message);
    throw error;
  }
};

export const fetchRoadmapData = async (id: string) => {
  try {
    const response = await apiClient(`/roadmap/${id}`);
    return response.data;
  } catch (e) {
    const error = e as Error;
    console.error('Error in fetchRoadmapData api:', error.message);
    throw error;
  }
};

export const fetchDiagramData = async (roadmapData: any) => {
  try {
    const response = await apiClient(
      `/roadmap/diagram/${roadmapData.uniqueId}`
    );
    return response.data;
  } catch (e) {
    const error = e as Error;
    console.error('Error in fetchDiagramData api:', error.message);
    throw error;
  }
};

export const submitRoadmapContribution = async (
  roadmapId: string,
  contributionData: any
) => {
  try {
    const response = await apiClient.post(
      `/roadmap/${roadmapId}/contribute`,
      contributionData
    );
    return response.data;
  } catch (e) {
    const error = e as Error;
    console.error('Error in submitRoadmapContribution api:', error.message);
    throw error;
  }
};

export const getNotifications = async () => {
  try {
    const response = await apiClient(`/notification`);
    console.log('notifications : ', response.data);
    return response.data;
  } catch (e) {
    const error = e as Error;
    console.error('Error in getNotifications api:', error.message);
    throw error;
  }
};

export const getNotificationCount = async () => {
  try {
    const response = await apiClient(`/notification/count`);
    return response.data;
  } catch (e) {
    const error = e as Error;
    console.error('Error in getNotificationCount api:', error.message);
    throw error;
  }
};

export const markNotificationsAsRead = async (ids: string[]) => {
  try {
    const response = await apiClient.patch('/notification/mark-read', {
      notificationIds: ids,
    });
    return response.data;
  } catch (e) {
    const error = e as Error;
    console.error('Error in markNotificationsAsRead api:', error.message);
    throw error;
  }
};

export const getUserPosts = async (userId: string) => {
  try {
    const response = await apiClient(`/posts/user/${userId}`);
    return response.data;
  } catch (e) {
    const error = e as Error;
    console.error('Error in getUserPosts api:', error.message);
    throw error;
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const response = await apiClient(`/profile/user/${userId}`);
    return response.data;
  } catch (e) {
    const error = e as Error;
    throw error;
    console.error('Error in getUserProfile api:', error.message);
    throw e;
  }
};

export const followUser = async (userId: string) => {
  try {
    const response = await apiClient.patch(`/profile/user/${userId}/follow`);
    return response.data;
  } catch (e) {
    const error = e as Error;
    console.error('Error in followUser api:', error.message);
    throw error;
  }
};

export const getFollowers = async (userId: string) => {
  try {
    const response = await apiClient.get(`/profile/user/${userId}/followers`);
    return response.data;
  } catch (e) {
    const error = e as Error;
    console.error('Error in getFollowers api:', error.message);
    throw error;
  }
};

export const getFollowings = async (userId: string) => {
  try {
    const response = await apiClient.get(`/profile/user/${userId}/followings`);
    return response.data;
  } catch (e) {
    const error = e as Error;
    console.error('Error in getFollowings api:', error.message);
    throw error;
  }
};

export const updateUserApi = async (formData: any, headers: any) => {
  try {
    const response = await apiClient.patch('/profile/user', formData, {
      headers,
    });
    return response.data;
  } catch (e) {
    const error = e as Error;
    console.error('Error in updateUser api:', error.message);
    throw error;
  }
};

export const getContributors = async () => {
  try {
    const response = await apiClient.get(`/profile/users`);
    return response.data;
  } catch (e) {
    const error = e as Error;
    console.error('Error in getContributors api:', error.message);
    throw error;
  }
};

export const getRoadmapsByType = async (type: string) => {
  try {
    const response = await apiClient.get(`/roadmap/type?type=${type}`);
    return response.data;
  } catch (e) {
    const error = e as Error;
    console.error('Error in getRoadmapsByType api:', error.message);
    throw error;
  }
};

export const getRandomTopics = async (count: number) => {
  try {
    const response = await apiClient.get(
      `/recommendation/random-topics?count=${count}`
    );
    return response.data;
  } catch (e) {
    const error = e as Error;
    console.error('Error in getRandomTopics api:', error.message);
    throw error;
  }
};
