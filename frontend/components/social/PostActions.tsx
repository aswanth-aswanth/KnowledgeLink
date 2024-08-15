import React from 'react';
import { Heart, MessageSquareMore, Share } from 'lucide-react';
import { PostActionsProps } from '@/types/posts';

export function PostActions({
  post,
  onLike,
  onComment,
  onShare,
}: PostActionsProps) {
  return (
    <div className="flex justify-around items-center mb-4 border-t border-b border-gray-200 dark:border-gray-700 py-2">
      <button
        onClick={() => onLike(post._id)}
        className={`flex flex-col items-center transition-colors duration-200 ${
          post.isLiked
            ? 'text-red-600 dark:text-red-400'
            : 'text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
        }`}
      >
        <Heart
          className="w-6 h-6 mb-1"
          fill={post.isLiked ? 'currentColor' : 'none'}
        />
        <span className="text-xs">{post.likes.length} Likes</span>
      </button>
      <button
        onClick={onComment}
        className="flex flex-col items-center text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
      >
        <MessageSquareMore className="w-6 h-6 mb-1" />
        <span className="text-xs">{post.comments.length} Comments</span>
      </button>
      <button
        onClick={onShare}
        className="flex flex-col items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
      >
        <Share className="w-6 h-6 mb-1" />
        <span className="text-xs">Share</span>
      </button>
    </div>
  );
}
