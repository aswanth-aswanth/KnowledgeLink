import mongoose, { Schema, Document } from "mongoose";
import { IRoadmap, ITopic } from "../../interfaces/IRoadmap";

const TopicSchema: Schema<ITopic> = new Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    name: { type: String, required: true },
    uniqueId: { type: String },
    content: { type: String },
    contributorId: { type: String, default: "" },
    tags: { type: [String], default: [] },
    likes: { type: [String], default: [] }, 
    children: [{
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        name: { type: String, required: true },
        uniqueId: { type: String },
        content: { type: String },
        contributorId: { type: String, default: "" },
        tags: { type: [String], default: [] },
        likes: { type: [String], default: [] }, 
        children: [{
            _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
            name: { type: String, required: true },
            content: { type: String },
            uniqueId: { type: String },
            contributorId: { type: String, default: "" },
            tags: { type: [String], default: [] },
            likes: { type: [String], default: [] }, 
            children: [{ type: Schema.Types.ObjectId, ref: 'Topic' }]
        }]
    }]
}, { _id: false });

const RoadmapSchema: Schema<IRoadmap> = new Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    title: { type: String, required: true },
    description: { type: String },
    type: {
        type: String,
        required: true,
        enum: ['expert_collaboration', 'public_voting', 'moderator_submission']
    },
    tags: { type: [String], default: [] },
    uniqueId: { type: String },
    members: { type: [String], default: [] },
    creatorId: { type: String, required: true },
    topics: {
        type: new Schema({
            _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
            name: { type: String, required: true },
            content: { type: String },
            uniqueId: { type: String },
            contributorId: { type: String, default: "" },
            tags: { type: [String], default: [] },
            likes: { type: [String], default: [] }, 
            children: [TopicSchema]
        }),
        required: true
    },
    media: [{
        type: { type: String },
        url: { type: String },
        topicId: { type: String, required: false }
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Roadmap = mongoose.model<IRoadmap>('Roadmap', RoadmapSchema);

export default Roadmap;
