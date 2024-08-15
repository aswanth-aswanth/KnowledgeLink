import React from 'react';
import { PostCard } from './PostCard';
import { usePostFeed } from '@/hooks/usePostFeed';

export function PostFeed() {
  const { posts, handleLike, handleComment } = usePostFeed();

  return (
    <div className="space-y-6 flex flex-col items-center mx-auto">
      {posts.map((postData) => (
        <PostCard
          key={postData._id}
          post={postData}
          onLike={handleLike}
          onComment={handleComment}
        />
      ))}
    </div>
  );
}
