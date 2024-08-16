import { Post } from "./Post";

export interface PostHeaderProps {
    post: Post;
    onSave: () => void;
}