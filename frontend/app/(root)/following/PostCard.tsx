import React, { useState } from "react";
import {
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  Send,
  MessageSquareMore,
} from "lucide-react";
import { MediaGallery } from "./MediaGallery";
import { CommentSection } from "./CommentSection";
import apiClient from "@/api/apiClient";

interface Post {
  _id: string;
  title: string;
  description: string;
  content: {
    videos: { type: string; url: string; duration: number }[];
    images: { url: string }[];
  };
  createdAt: Date;
  creatorName: string;
  creatorEmail: string;
  likes: string[];
  isLiked: boolean;
}

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onComment: (postId: string, comment: string) => void;
  onShare: (postId: string) => void;
  onSave: (postId: string) => void;
}

export function PostCard({
  post,
  onLike,
  onComment,
  onShare,
  onSave,
}: PostCardProps) {
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);

  const mediaItems = [
    ...post.content.images.map((image) => ({
      type: "image" as const,
      url: image.url,
    })),
    ...post.content.videos.map((video) => ({
      type: "video" as const,
      url: video.url,
    })),
  ];

  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      onComment(post._id, commentText);
      setCommentText("");
    }
  };

  const handleAddReply = (commentId: string, replyText: string) => {
    // Implement reply functionality here
    console.log(`Replying to comment ${commentId}: ${replyText}`);
  };

  const handleAddComment = async (text: string) => {
    try {
      await apiClient.post(`/post/comment/${post._id}`, { text });
      // You might want to update the post's comment count here
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6">
      <div className="p-4">
        <div className="flex items-center mb-4">
          <img
            src={`https://ui-avatars.com/api/?name=${post.creatorName}&background=random`}
            alt={post.creatorName}
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <h3 className="font-bold text-lg">{post.creatorName}</h3>
            <p className="text-gray-600 text-sm">{post.creatorEmail}</p>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-4">{post.title}</h2>

        {/* Content */}
        <p className="text-gray-800 mb-4">{post.description}</p>

        {/* Media Gallery */}
        {mediaItems.length > 0 && (
          <div className="mb-4 max-w-2xl">
            <MediaGallery mediaItems={mediaItems} />
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center text-gray-600 text-sm mb-4">
          <span>{new Date(post.createdAt).toLocaleString()}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-start gap-4 mb-4">
          <button
            onClick={() => onLike(post._id)}
            className={`flex items-center ${
              post.isLiked ? "text-red-500" : "text-gray-600 hover:text-red-500"
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
            className="flex items-center text-gray-600 hover:text-green-500"
          >
            <MessageSquareMore className="w-5 h-5 mr-1" />
            <span>Comments ({post.comments.length})</span>
          </button>
          <button
            onClick={() => onShare(post._id)}
            className="flex items-center text-gray-600 hover:text-blue-500"
          >
            <Share className="w-5 h-5 mr-1" />
            <span>Share</span>
          </button>
          <button
            onClick={() => onSave(post._id)}
            className="flex items-center text-gray-600 hover:text-green-500"
          >
            <Bookmark className="w-5 h-5 mr-1" />
            <span>Save</span>
          </button>
        </div>
        {showComments && (
          <CommentSection postId={post._id} onAddComment={handleAddComment} />
        )}

        {/* Comment Input */}
        {/* <div className="flex items-center">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="flex-grow border rounded-l-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleCommentSubmit}
            className="bg-blue-500 text-white rounded-r-full py-2 px-4 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Send className="w-5 h-5" />
          </button>
        </div> */}
      </div>
    </div>
  );
}
