import { Post } from "./Post";

export interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onShare?: (postId: string) => void;
  onSave?: (postId: string) => void;
  onComment: (postId: string, comment: string) => void;
}
