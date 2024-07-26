import mongoose, { Schema, Document } from 'mongoose';

export interface IReadReceipt {
    userId: mongoose.Types.ObjectId;
    readAt: Date;
}

export interface IMessageDocument extends Document {
    _id: mongoose.Types.ObjectId;
    senderId: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
    readBy: IReadReceipt[];
}

export const MessageSchema = new Schema<IMessageDocument>({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    readBy: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        readAt: {
            type: Date
        }
    }]
});

const MessageModel = mongoose.model<IMessageDocument>('Message', MessageSchema);
export default MessageModel;
