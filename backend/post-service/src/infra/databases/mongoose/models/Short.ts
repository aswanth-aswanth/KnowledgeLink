import mongoose, { Schema, Document } from 'mongoose';

export interface IShort extends Document {
    title: string;
    description: string;
    videoUrl: string;
    tags?: string[];
    createdAt: Date;
    updatedAt: Date;
    creatorId: string;
    likes: string[];
    views: number;
}

const ShortSchema = new Schema<IShort>({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    videoUrl: {
        type: String,
        required: true
    },
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
    creatorId: {
        type: String,
        required: true
    },
    likes: {
        type: [String],
        default: []
    },
    views: {
        type: Number,
        default: 0
    }
});

ShortSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

const Short = mongoose.model<IShort>('Short', ShortSchema);
export default Short;