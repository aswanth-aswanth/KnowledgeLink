import mongoose, { Schema, Document } from 'mongoose';

export interface IMessageDocument extends Document {
    _id: mongoose.Types.ObjectId;
    senderId: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
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
    }
});

const MessageModel = mongoose.model<IMessageDocument>('Message', MessageSchema);
export default MessageModel;