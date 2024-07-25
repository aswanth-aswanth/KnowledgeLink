import mongoose, { Schema } from 'mongoose';
import { IUserInteraction } from '../../interfaces/IUserInteraction';

const UserInteractionSchema = new Schema<IUserInteraction>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    roadmapId: { type: Schema.Types.ObjectId, ref: 'Roadmap', required: true },
    topicId: { type: Schema.Types.ObjectId, required: true },
    interactionType: { type: String, enum: ['view', 'like', 'comment'], required: true },
    timestamp: { type: Date, default: Date.now }
});

export default mongoose.model<IUserInteraction>('UserInteraction', UserInteractionSchema);