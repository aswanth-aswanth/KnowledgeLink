// src/types/postTypes.ts

export interface Post {
    id: string;
    title: string;
    content: string;
    authorId: string;
    createdAt: string;
    updatedAt: string;
}

export interface PostFeedProps {
    posts: Post[];
}
