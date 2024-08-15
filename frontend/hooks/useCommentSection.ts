import { useState, useEffect } from 'react';
import apiClient from '@/api/apiClient';
import { Comment } from '@/types/posts/Comment';

export function useCommentSection(postId: string) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [showReplies, setShowReplies] = useState<{ [key: string]: boolean }>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get(`/post/comments/${postId}`);
            setComments(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch comments');
            console.error('Error fetching comments:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async () => {
        if (newComment.trim()) {
            try {
                await apiClient.post('/post/comment', { postId, text: newComment });
                setNewComment('');
                fetchComments();
            } catch (err) {
                console.error('Error adding comment:', err);
            }
        }
    };

    const handleReply = (commentId: string) => {
        setReplyingTo(replyingTo === commentId ? null : commentId);
    };

    const handleAddReply = async (commentId: string) => {
        if (newComment.trim()) {
            try {
                await apiClient.post('/post/reply', { commentId, text: newComment });
                setNewComment('');
                setReplyingTo(null);
                fetchComments();
            } catch (err) {
                console.error('Error adding reply:', err);
            }
        }
    };

    const toggleShowReplies = async (commentId: string) => {
        if (!showReplies[commentId]) {
            try {
                const response = await apiClient.get(`/post/replies/${commentId}`);
                setComments((prevComments) =>
                    prevComments.map((comment) =>
                        comment._id === commentId
                            ? { ...comment, replies: response.data }
                            : comment
                    )
                );
            } catch (err) {
                console.error('Error fetching replies:', err);
            }
        }
        setShowReplies((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
    };

    return {
        comments,
        newComment,
        setNewComment,
        handleAddComment,
        handleReply,
        handleAddReply,
        toggleShowReplies,
        showReplies,
        loading,
        error,
    };
}