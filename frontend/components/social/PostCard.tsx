import React, { useState } from 'react';
import {
  Heart,
  MessageSquareMore,
  Share,
  X,
  Link as LinkIcon,
  MoreVertical,
} from 'lucide-react';
import { MediaGallery } from './MediaGallery';
import { CommentSection } from './CommentSection';
import {
  WhatsappShareButton,
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappIcon,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
} from 'react-share';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';
import apiClient from '@/api/apiClient';
import toast from 'react-hot-toast';

interface Post {
  _id: string;
  title: string;
  description: string;
  content: {
    videos: { type: string; url: string; duration: number }[];
    images: { url: string }[];
  };
  audios?: string[];
  createdAt: Date;
  creatorName?: string;
  creatorEmail: string;
  likes: string[];
  comments: any[];
  isLiked: boolean;
}

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
  onComment: (postId: string, comment: string) => void;
}

export function PostCard({ post, onLike, onSave, onComment }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleCloseModal = () => {
    setShowShareModal(false);
  };

  const shareUrl = `${window.location.origin}/post/${post._id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    });
  };

  const handleSavePost = async () => {
    try {
      await apiClient.post('/profile/save-post', { postId: post._id });
      onSave(post._id);
      toast.success('Post saved successfully!');
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Failed to save post. Please try again.');
    }
  };

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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6 transition-all duration-300 hover:shadow-xl max-w-2xl w-full mx-auto">
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center mb-4">
          <img
            src={`https://ui-avatars.com/api/?name=${post.creatorName}&background=random`}
            alt={post.creatorName}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-3 sm:mr-4 border-2 border-blue-500 dark:border-blue-400"
          />
          <div>
            <h3 className="font-bold text-lg sm:text-xl dark:text-white">
              {post.creatorName}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="ml-auto dark:text-white">
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            >
              <DropdownMenuItem
                className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSavePost();
                }}
              >
                Save Post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-bold mb-3 dark:text-white">
          {post.title}
        </h2>

        {/* Content */}
        <p className="text-gray-800 dark:text-gray-200 mb-4">
          {post.description}
        </p>

        {/* Media Gallery */}
        {mediaItems.length > 0 && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <MediaGallery mediaItems={mediaItems} />
          </div>
        )}

        {/* Action Buttons */}
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
            onClick={() => setShowComments(!showComments)}
            className={`flex flex-col items-center transition-colors duration-200 ${
              showComments
                ? 'text-green-600 dark:text-green-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400'
            }`}
          >
            <MessageSquareMore className="w-6 h-6 mb-1" />
            <span className="text-xs">{post.comments.length} Comments</span>
          </button>
          <button
            onClick={handleShare}
            className="flex flex-col items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
          >
            <Share className="w-6 h-6 mb-1" />
            <span className="text-xs">Share</span>
          </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <CommentSection
              postId={post._id}
              comments={post.comments}
              onComment={(comment) => onComment(post._id, comment)}
            />
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-lg dark:text-white">Share Post</h4>
              <button
                onClick={handleCloseModal}
                className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex justify-around mb-4">
              <WhatsappShareButton url={shareUrl}>
                <WhatsappIcon size={32} round />
              </WhatsappShareButton>
              <FacebookShareButton url={shareUrl}>
                <FacebookIcon size={32} round />
              </FacebookShareButton>
              <TwitterShareButton url={shareUrl}>
                <TwitterIcon size={32} round />
              </TwitterShareButton>
              <LinkedinShareButton url={shareUrl}>
                <LinkedinIcon size={32} round />
              </LinkedinShareButton>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleCopyLink}
                className={`text-sm font-semibold py-2 px-4 rounded-lg transition-colors duration-200 ${
                  linkCopied
                    ? 'bg-green-600 dark:bg-green-400 text-white'
                    : 'bg-blue-600 dark:bg-blue-400 text-white hover:bg-blue-500 dark:hover:bg-blue-300'
                }`}
              >
                {linkCopied ? 'Link Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
