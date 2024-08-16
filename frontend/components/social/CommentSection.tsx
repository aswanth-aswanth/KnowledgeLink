import React from 'react';
import { CommentList } from './CommentList';
import { CommentForm } from './CommentForm';
import { useCommentSection } from '@/hooks/useCommentSection';
import { CommentSectionProps } from '@/types/posts/CommentSectionProps';

export function CommentSection({ postId }: CommentSectionProps) {
  const {
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
  } = useCommentSection(postId);

  if (loading) return <p>Loading comments...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="space-y-4">
      <CommentList
        comments={comments}
        onReply={handleReply}
        onAddReply={handleAddReply}
        onToggleReplies={toggleShowReplies}
        showReplies={showReplies}
      />
      <CommentForm
        value={newComment}
        onChange={setNewComment}
        onSubmit={handleAddComment}
      />
    </div>
  );
}
