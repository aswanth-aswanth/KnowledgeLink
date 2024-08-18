export interface Post {
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
    creatorId?: string;
    likes: string[];
    comments: any[];
    isLiked: boolean;
  }
  