"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { PostCard } from "./PostCard";
import apiClient from "@/api/apiClient";
import { Post } from "@/types/posts";

export default function SharedPostPage() {
  const { postId } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await apiClient(`/post/posts/${postId}`);
        setPost(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load post");
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleLike = async (postId: string) => {
    // Implement like functionality
  };

  const handleComment = async (postId: string, comment: string) => {
    // Implement comment functionality
  };

  const handleShare = (postId: string) => {
    // Implement share functionality
  };

  const handleSave = (postId: string) => {
    // Implement save functionality
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">Shared Post</h1>
      <PostCard
        post={post}
        onLike={handleLike}
        onComment={handleComment}
        onShare={handleShare}
        onSave={handleSave}
      />
    </div>
  );
}
