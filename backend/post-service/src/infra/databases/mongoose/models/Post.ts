import mongoose, { Schema, Document } from 'mongoose';
import { IComment } from './Comment';

interface Video {
    type: 'youtubeVideo' | 'videoFile';
    url: string;
    duration: number;
}

interface Image {
    url: string;
}

export interface IPost extends Document {
    title?: string;
    description: string;
    content: {
        videos: Video[];
        images: Image[];
    };
    audios?: string[];
    tags?: string[];
    createdAt: Date;
    updatedAt: Date;
    creatorId: string;
    likes: string[];
    comments: IComment['_id'][];
}

// Define the Post schema
const PostSchema = new Schema<IPost>({
    title: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        videos: [{
            type: {
                type: String,
                enum: ['youtubeVideo', 'videoFile'],
                required: true
            },
            url: {
                type: String,
                required: true
            },
            duration: {
                type: Number,
                required: true
            }
        }],
        images: [{
            url: {
                type: String,
                required: true
            }
        }]
    },
    audios: [{
        type: String,
        required: false
    }],
    tags: [{
        type: String,
        required: false
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }, 
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    creatorId: {
        type: String,
        required: true
    },
    likes: {
        type: [String],
        default: []
    },
});

// Middleware to update the updatedAt field before saving
PostSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

const Post = mongoose.model<IPost>('Post', PostSchema);
export default Post;
