import { Post } from "./Post";

export interface PostActionsProps {
    post: Post;
    onLike: (postId: string) => void;
    onComment: () => void;
    onShare: () => void;
}