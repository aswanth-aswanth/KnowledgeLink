import mongoose, { Schema, Document, Types } from "mongoose";
import { IRoadmap, ITopic } from '../../interfaces/IRoadmap';

const TopicSchema: Schema<ITopic> = new Schema({
    name: { type: String, required: true },
    content: { type: String, required: true },
    children: { type: [this], default: [] }
});

const RoadmapSchema: Schema<IRoadmap> = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: {
        type: String,
        required: true,
        enum: ['expert_collaboration', 'public_voting', 'moderator_submission']
    },
    tags: [{ type: String, required: true }],
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    topics: { type: TopicSchema, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Roadmap = mongoose.model<IRoadmap>('Roadmap', RoadmapSchema);

export default Roadmap;
