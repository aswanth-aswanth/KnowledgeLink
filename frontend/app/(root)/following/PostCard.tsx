import React, { useState } from "react";
import {
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  Send,
  MessageSquareMore,
  X,
  Link as LinkIcon,
} from "lucide-react";
import { MediaGallery } from "./MediaGallery";
import { CommentSection } from "./CommentSection";
import apiClient from "@/api/apiClient";
import {
  WhatsappShareButton,
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappIcon,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
} from "react-share";

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
  onShare: (postId: string) => void;
  onSave: (postId: string) => void;
  onComment: (postId: string, comment: string) => void;
}

export function PostCard({
  post,
  onLike,
  onShare,
  onSave,
  onComment,
}: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const handleShare = () => {
    setShowShareOptions(true);
  };

  const shareUrl = `${window.location.origin}/post/${post._id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    });
  };

  const mediaItems = [
    ...post.content.images.map((image) => ({
      type: "image" as const,
      url: image.url,
    })),
    ...post.content.videos.map((video) => ({
      type: "video" as const,
      url: video.url,
    })),
    ...(post.audios?.map((audio) => ({
      type: "audio" as const,
      url: audio,
    })) || []),
  ];

  return (
    <div className="bg-white dark:bg-gray-800 sm:rounded-2xl shadow-md overflow-hidden mb-6">
      <div className="p-1 py-3 sm:p-4">
        <div className="flex items-center mb-4">
          <img
            src={`https://ui-avatars.com/api/?name=${post.creatorName}&background=random`}
            alt={post.creatorName}
            className="w-6 h-6 sm:w-10 sm:h-10 rounded-full mr-2 sm:mr-4"
          />
          <div>
            <h3 className="font-bold text-lg dark:text-white">
              {post.creatorName}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {post.creatorEmail}
            </p>
          </div>
        </div>

        {/* Title */}
        <h2 className="sm:text-2xl font-bold mb-4 dark:text-white">
          {post.title}
        </h2>

        {/* Content */}
        <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 mb-4">
          {post.description}
        </p>

        {/* Media Gallery */}
        {mediaItems.length > 0 && (
          <div className="mb-4 max-w-2xl">
            <MediaGallery mediaItems={mediaItems} />
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-4">
          <span>{new Date(post.createdAt).toLocaleString()}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex text-xs sm:text-base justify-start gap-4 mb-4">
          <button
            onClick={() => onLike(post._id)}
            className={`flex items-center ${
              post.isLiked
                ? "text-red-500"
                : "text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400"
            }`}
          >
            <Heart
              className="w-5 h-5 mr-1"
              fill={post.isLiked ? "currentColor" : "none"}
            />
            <span>Like ({post.likes.length})</span>
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400"
          >
            <MessageSquareMore className="w-5 h-5 mr-1" />
            <span>Comments ({post.comments.length})</span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
          >
            <Share className="w-5 h-5 mr-1" />
            <span>Share</span>
          </button>
          <button
            onClick={() => onSave(post._id)}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400"
          >
            <Bookmark className="w-5 h-5 mr-1" />
            <span>Save</span>
          </button>
        </div>

        {/* Share Options */}
        {showShareOptions && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl relative">
              <button
                onClick={() => setShowShareOptions(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
              <h3 className="text-lg font-semibold mb-4 dark:text-white">
                Share this post
              </h3>
              <div className="flex space-x-4 mb-4">
                <WhatsappShareButton url={shareUrl} title={post.title}>
                  <WhatsappIcon size={40} round />
                </WhatsappShareButton>
                <FacebookShareButton url={shareUrl} quote={post.title}>
                  <FacebookIcon size={40} round />
                </FacebookShareButton>
                <TwitterShareButton url={shareUrl} title={post.title}>
                  <TwitterIcon size={40} round />
                </TwitterShareButton>
                <LinkedinShareButton url={shareUrl} title={post.title}>
                  <LinkedinIcon size={40} round />
                </LinkedinShareButton>
                <button
                  onClick={handleCopyLink}
                  className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  <LinkIcon
                    size={24}
                    className="text-gray-600 dark:text-gray-300"
                  />
                </button>
              </div>
              {linkCopied && (
                <p className="text-green-500 text-sm">
                  Link copied to clipboard!
                </p>
              )}
            </div>
          </div>
        )}

        {showComments && <CommentSection postId={post._id} />}
      </div>
    </div>
  );
}
