import React from 'react';
import { PostHeader } from './PostHeader';
import { PostContent } from './PostContent';
import { PostActions } from './PostActions';
import { CommentSection } from './CommentSection';
import { ShareModal } from './ShareModal';
import { usePostCard } from '@/hooks/usePostCard';
import { PostCardProps } from '@/types/posts';

export function PostCard({ post, onLike, onComment }: PostCardProps) {
  const {
    showComments,
    showShareModal,
    handleShare,
    handleCloseModal,
    handleSavePost,
    toggleComments,
  } = usePostCard(post._id);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6 transition-all duration-300 hover:shadow-xl max-w-2xl w-full mx-auto">
      <div className="p-4 sm:p-6">
        <PostHeader post={post} onSave={handleSavePost} />
        <PostContent post={post} />
        <PostActions
          post={post}
          onLike={onLike}
          onComment={toggleComments}
          onShare={handleShare}
        />
        {showComments && (
          <CommentSection
            postId={post._id}
            comments={post.comments}
            onComment={(comment) => onComment(post._id, comment)}
          />
        )}
      </div>
      {showShareModal && (
        <ShareModal postId={post._id} onClose={handleCloseModal} />
      )}
    </div>
  );
}
