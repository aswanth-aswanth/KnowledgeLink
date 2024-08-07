import mongoose, { Schema } from "mongoose";
import { IAnswer, IFAQ } from "../../interfaces/Faq";

// Answer Schema
const AnswerSchema: Schema<IAnswer> = new Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    content: { type: String, required: true },
    contributorId: { type: String, required: true },
    likes: { type: [String], default: [] },
    upvotes: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now }
});

// FAQ Schema
const FAQSchema: Schema<IFAQ> = new Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    roadmapId: { type: mongoose.Schema.Types.ObjectId, ref: 'Roadmap', required: true },
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
    topicUniqueId: { type: String, required: true },
    question: { type: String, required: true },
    contributorId: { type: String, required: true },
    likes: { type: [String], default: [] },
    upvotes: { type: [String], default: [] },
    answers: { type: [AnswerSchema], default: [] },
    createdAt: { type: Date, default: Date.now }
});

const FAQ = mongoose.model<IFAQ>('FAQ', FAQSchema);

export default FAQ;
