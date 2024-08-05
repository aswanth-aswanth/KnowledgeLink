export interface Post {
    _id: string;
    title: string;
    description: string;
    content: {
        videos: { type: string; url: string; duration: number }[];
        images: { url: string }[];
    };
    audios?: string[];
    createdAt: Date;
    creatorName?: string;
    creatorEmail: string;
    likes: string[];
    comments: any[];
    isLiked: boolean;
}
