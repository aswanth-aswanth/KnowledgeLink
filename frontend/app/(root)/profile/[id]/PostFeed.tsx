import { useState, useEffect } from "react";
import { PostCard } from "./PostCard";
import apiClient from "@/api/apiClient";
import { usePathname } from "next/navigation";

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
  creatorId: string;
  likes: string[];
  comments: any[];
  isLiked: boolean;
}

export function PostFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const email = pathname.split("/")[2];
      const response = await apiClient(`/post/user-posts/${email}`);
      const { data } = response;
      console.log("Data posts : ", data);
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await apiClient.put(`/post/like/${postId}`);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                isLiked: !post.isLiked,
                likes: post.isLiked
                  ? post.likes.filter((likeId) => likeId !== "currentUserEmail")
                  : [...post.likes, "currentUserEmail"],
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleComment = async (postId: string, comment: string) => {
    try {
      const response = await apiClient.post(`/post/comment/${postId}`, {
        text: comment,
      });
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, comments: [...post.comments, response.data] }
            : post
        )
      );
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
          onShare={handleShare}
          onSave={handleSave}
        />
      ))}
    </div>
  );
}
