export interface CommentSectionProps {
    postId: string;
    comments: Comment[];
    onComment: (comment: string) => void;
}