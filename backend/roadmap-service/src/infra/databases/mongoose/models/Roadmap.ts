
import mongoose, { Schema, Document } from "mongoose";
import { IRoadmap, ITopic } from "../../interfaces/IRoadmap";

const TopicSchema: Schema<ITopic> = new Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    name: { type: String, required: true },
    content: { type: String, required: true },
    children: [{
        type: new Schema({
            _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
            name: { type: String, required: true },
            content: { type: String, required: true },
            children: [{ type: Schema.Types.ObjectId, ref: 'Topic' }]
        }, { _id: false })
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
    tags: [{ type: String, required: true }],
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    topics: {
        type: new Schema({
            _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
            name: { type: String, required: true },
            content: { type: String, required: true },
            children: [TopicSchema]
        }, { _id: false }),
        required: true
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Roadmap = mongoose.model<IRoadmap>('Roadmap', RoadmapSchema);

export default Roadmap;
