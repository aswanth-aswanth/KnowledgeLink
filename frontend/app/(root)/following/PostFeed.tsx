// components/PostFeed.tsx
import { useState, useEffect } from "react";
import { PostCard } from "./PostCard";
import apiClient from "@/api/apiClient";

interface Post {
  _id: string;
  title?: string;
  description: string;
  content: {
    videos: {
      type: "youtubeVideo" | "videoFile";
      url: string;
      duration: number;
    }[];
    images: { url: string }[];
  };
  audios?: string[];
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  creatorEmail: string;
  likes: string[];
  comments: any[];
  isLiked: boolean;
}

export function PostFeed() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      /* const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }); */
      const response = await apiClient("/post/posts");
      console.log("response : ", response);
      const { data } = response;
      console.log("Data : ", data);
      setPosts(data.posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      fetchPosts(); // Refetch posts to update the UI
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleComment = async (postId: string, comment: string) => {
    try {
      await fetch(`/api/posts/${postId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      fetchPosts(); // Refetch posts to update the UI
    } catch (error) {
      console.error("Error commenting on post:", error);
    }
  };

  const handleShare = (postId: string) => {
    // Implement share functionality
    console.log("Sharing post:", postId);
  };

  const handleSave = (postId: string) => {
    // Implement save functionality
    console.log("Saving post:", postId);
  };

  return (
    <div className="space-y-6 flex flex-col  items-center mx-auto ">
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          onLike={handleLike}
          onComment={handleComment}
          onShare={handleShare}
          onSave={handleSave}
        />
      ))}
    </div>
  );
}
