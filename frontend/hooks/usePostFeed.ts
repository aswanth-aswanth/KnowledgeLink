import { useState, useEffect } from 'react';
import { getPosts, addLike, addComment } from '@/api/post';
import { Post } from '@/types/posts';

export function usePostFeed() {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const data = await getPosts();
            setPosts(data.posts);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const handleLike = async (postId: string) => {
        try {
            await addLike(postId);
            setPosts((prevPosts) =>
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
            const response = await addComment(postId, comment);
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post._id === postId
                        ? { ...post, comments: [...post.comments, response] }
                        : post
                )
            );
        } catch (error) {
            console.error('Error commenting on post:', error);
        }
    };

    return { posts, handleLike, handleComment };
}