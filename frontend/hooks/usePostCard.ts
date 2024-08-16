import { useState } from 'react';
import apiClient from '@/api/apiClient';
import toast from 'react-hot-toast';
import { savePost } from '@/api/post';

export function usePostCard(postId: string) {
    const [showComments, setShowComments] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);

    const handleShare = () => setShowShareModal(true);
    const handleCloseModal = () => setShowShareModal(false);
    const toggleComments = () => setShowComments(!showComments);

    const handleSavePost = async () => {
        try {
            await savePost(postId);
            toast.success('Post saved successfully!');
        } catch (error) {
            console.error('Error saving post:', error);
            toast.error('Failed to save post. Please try again.');
        }
    };

    return {
        showComments,
        showShareModal,
        handleShare,
        handleCloseModal,
        handleSavePost,
        toggleComments,
    };
}