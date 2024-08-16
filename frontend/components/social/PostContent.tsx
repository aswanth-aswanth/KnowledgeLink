import React from 'react';
import { MediaGallery } from './MediaGallery';
import { PostContentProps } from '@/types/posts';

export function PostContent({ post }: PostContentProps) {
  const mediaItems = [
    ...post.content.images.map((image) => ({
      type: 'image' as const,
      url: image.url,
    })),
    ...post.content.videos.map((video) => ({
      type: 'video' as const,
      url: video.url,
    })),
    ...(post.audios?.map((audio) => ({
      type: 'audio' as const,
      url: audio,
    })) || []),
  ];

  return (
    <>
      <h2 className="text-xl sm:text-2xl font-bold mb-3 dark:text-white">
        {post.title}
      </h2>
      <p className="text-gray-800 dark:text-gray-200 mb-4">
        {post.description}
      </p>
      {mediaItems.length > 0 && (
        <div className="mb-4 rounded-lg overflow-hidden">
          <MediaGallery mediaItems={mediaItems} />
        </div>
      )}
    </>
  );
}
