import { Types } from 'mongoose';

export interface UserInteraction {
  userId: Types.ObjectId;
  roadmapId: Types.ObjectId;
  topicId: Types.ObjectId;
  interactionType: 'view' | 'like' | 'comment';
  timestamp: Date;
}