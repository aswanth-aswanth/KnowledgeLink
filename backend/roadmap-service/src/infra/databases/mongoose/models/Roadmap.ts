import mongoose, { Schema, Document } from "mongoose";
import { IRoadmap, ITopic } from "../../interfaces/IRoadmap";

const TopicSchema: Schema<ITopic> = new Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    name: { type: String, required: true },
    content: { type: String, required: true },
    contributorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    tags: { type: [String], default: [] }, // Tags as array of strings with default empty array
    children: [{
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        name: { type: String, required: true },
        content: { type: String, required: true },
        contributorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
        tags: { type: [String], default: [] }, // Tags as array of strings with default empty array
        children: [{
            _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
            name: { type: String, required: true },
            content: { type: String, required: true },
            contributorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
            tags: { type: [String], default: [] }, // Tags as array of strings with default empty array
            children: [{ type: Schema.Types.ObjectId, ref: 'Topic' }]
        }]
    }]
}, { _id: false });

const RoadmapSchema: Schema<IRoadmap> = new Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: {
        type: String,
        required: true,
        enum: ['expert_collaboration', 'public_voting', 'moderator_submission']
    },
    tags: { type: [String], default: [] }, // Tags as array of strings with default empty array
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    topics: {
        type: new Schema({
            _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
            name: { type: String, required: true },
            content: { type: String, required: true },
            contributorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
            tags: { type: [String], default: [] }, // Tags as array of strings with default empty array
            children: [TopicSchema]
        }),
        required: true
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Roadmap = mongoose.model<IRoadmap>('Roadmap', RoadmapSchema);

export default Roadmap;
