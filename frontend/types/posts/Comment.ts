export interface Comment {
    _id: string;
    text: string;
    author: string;
    createdAt: string;
    replyCount: number;
    replies?: Comment[];
}

export interface CommentSectionProps {
    postId: string;
}

export interface CommentListProps {
    comments: Comment[];
    onReply: (commentId: string) => void;
    onAddReply: (commentId: string) => void;
    onToggleReplies: (commentId: string) => void;
    showReplies: { [key: string]: boolean };
}

export interface CommentFormProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
}