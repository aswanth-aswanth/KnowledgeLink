import mongoose, { Schema, Document } from 'mongoose';
import { MessageSchema, IMessageDocument } from './Message';

export interface IChatDocument extends Document {
  _id: mongoose.Types.ObjectId;
  participants: mongoose.Types.ObjectId[];
  type: 'individual' | 'group';
  messages: IMessageDocument[];
  createdAt: Date;
  updatedAt: Date;
  name?: string;
}

const ChatSchema = new Schema<IChatDocument>({
  name: {
    type: String,
    trim: true
  },
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  type: {
    type: String,
    enum: ['individual', 'group'],
    required: true
  },
  messages: [MessageSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

ChatSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const ChatModel = mongoose.model<IChatDocument>('Chat', ChatSchema);
export default ChatModel;
