import { useState, useEffect } from 'react';
import apiClient from '@/api/apiClient';
import { Post } from '@/types/posts';

export function useSavedPosts() {
    const [savedPosts, setSavedPosts] = useState<Post[]>([]);

    const fetchSavedPosts = async () => {
        try {
            const response = await apiClient.get('/post/saved-posts');
            setSavedPosts(response.data.posts);
        } catch (error) {
            console.error('Error fetching saved posts:', error);
        }
    };

    const handleLike = async (postId: string) => {
        try {
            await apiClient.post(`/post/${postId}/like`);
            setSavedPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post._id === postId
                        ? {
                            ...post,
                            isLiked: !post.isLiked,
                            likes: post.isLiked
                                ? post.likes.filter((likeId) => likeId !== 'currentUserEmail')
                                : [...post.likes, 'currentUserEmail'],
                        }
                        : post
                )
            );
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleComment = async (postId: string, comment: string) => {
        try {
            const response = await apiClient.post(`/post/${postId}/comment`, { content: comment });
            setSavedPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post._id === postId
                        ? { ...post, comments: [...post.comments, response.data] }
                        : post
                )
            );
        } catch (error) {
            console.error('Error commenting on post:', error);
        }
    };

    useEffect(() => {
        fetchSavedPosts();
    }, []);

    return { savedPosts, handleLike, handleComment, fetchSavedPosts };
}