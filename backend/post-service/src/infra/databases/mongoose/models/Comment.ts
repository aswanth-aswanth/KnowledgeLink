import mongoose, { Schema, Document, Types } from 'mongoose';

// Define the Reply interface
interface IReply {
    _id?: Types.ObjectId;
    text: string;
    author: string;
    createdAt?: Date;
    updatedAt?: Date;
    isDeleted?: boolean;
}

// Define the Comment interface
export interface IComment extends Document {
    text: string;
    author: string;
    replies: IReply[];
    createdAt?: Date;
    updatedAt?: Date;
    isDeleted?: boolean;
}

// Define the Reply schema
const ReplySchema = new Schema<IReply>({
    text: {
        type: String,
        required: true,
        trim: true,
    },
    author: {
        type: String,
        required: true,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

// Define the Comment schema
const CommentSchema = new Schema<IComment>({
    text: {
        type: String,
        required: true,
        trim: true,
    },
    author: {
        type: String,
        required: true,
        trim: true,
    },
    replies: {
        type: [ReplySchema],
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    isDeleted: { type: Boolean, default: false }
});

// Middleware to update the updatedAt field before saving
CommentSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

const Comment = mongoose.model<IComment>('Comment', CommentSchema);
export default Comment;
