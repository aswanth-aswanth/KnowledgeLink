import React, { useState, useEffect } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MessageCircle, Send, ChevronDown, ChevronUp } from "lucide-react";
import apiClient from "@/api/apiClient";

interface Comment {
  _id: string;
  text: string;
  author: string;
  createdAt: string;
  replyCount: number;
}

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [showReplies, setShowReplies] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/post/comments/${postId}`);
      setComments(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch comments");
      console.error("Error fetching comments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        await apiClient.post("/post/comment", { postId, text: newComment });
        setNewComment("");
        fetchComments(); // Refresh comments after adding a new one
      } catch (err) {
        console.error("Error adding comment:", err);
      }
    }
  };

  const handleReply = (commentId: string) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
  };

  const handleAddReply = async (commentId: string) => {
    if (newComment.trim()) {
      try {
        await apiClient.post(`/post/reply/${commentId}`, { text: newComment });
        setNewComment("");
        setReplyingTo(null);
        fetchComments(); // Refresh comments to show new reply count
      } catch (err) {
        console.error("Error adding reply:", err);
      }
    }
  };

  const toggleShowReplies = async (commentId: string) => {
    if (!showReplies[commentId]) {
      try {
        const response = await apiClient.get(`/post/replies/${commentId}`);
        // Update the comment with its replies
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment._id === commentId
              ? { ...comment, replies: response.data }
              : comment
          )
        );
      } catch (err) {
        console.error("Error fetching replies:", err);
      }
    }
    setShowReplies((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  if (loading) return <p>Loading comments...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <Card key={comment._id} className="p-4">
          <div className="flex items-start space-x-4">
            <Avatar>
              <img
                src={`https://ui-avatars.com/api/?name=${comment.author}&background=random`}
                alt={comment.author}
              />
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold">{comment.author}</p>
              <p className="text-sm text-gray-500">
                {new Date(comment.createdAt).toLocaleString()}
              </p>
              <p className="mt-1">{comment.text}</p>
              <div className="mt-2 flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleReply(comment._id)}
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Reply
                </Button>
                {comment.replyCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleShowReplies(comment._id)}
                  >
                    {showReplies[comment._id] ? (
                      <ChevronUp className="w-4 h-4 mr-1" />
                    ) : (
                      <ChevronDown className="w-4 h-4 mr-1" />
                    )}
                    {comment.replyCount}{" "}
                    {comment.replyCount === 1 ? "Reply" : "Replies"}
                  </Button>
                )}
              </div>
              {replyingTo === comment._id && (
                <div className="mt-2 flex items-center space-x-2">
                  <Input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a reply..."
                    className="flex-1"
                  />
                  <Button onClick={() => handleAddReply(comment._id)}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              )}
              {showReplies[comment._id] && comment.replies && (
                <div className="mt-2 pl-4 border-l-2 border-gray-200">
                  {comment.replies.map((reply: Comment) => (
                    <div key={reply._id} className="mt-2">
                      <p className="font-semibold">{reply.author}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(reply.createdAt).toLocaleString()}
                      </p>
                      <p>{reply.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
      <div className="flex items-center space-x-2">
        <Input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1"
        />
        <Button onClick={handleAddComment}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
