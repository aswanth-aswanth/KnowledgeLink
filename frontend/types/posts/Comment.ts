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