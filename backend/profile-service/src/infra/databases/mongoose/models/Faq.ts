// src/infra/databases/mongoose/models/Faq.ts

import mongoose, { Schema, Document } from "mongoose";
import { IFaq } from "../../interfaces/IFaq";

const AnswerSchema: Schema = new Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    content: { type: String, required: true },
    authorId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    upvotes: { type: [String], default: [] },
});

const FaqSchema: Schema = new Schema({
    roadmapId: { type: mongoose.Schema.Types.ObjectId, ref: 'Roadmap', required: true },
    topicId: { type: mongoose.Schema.Types.ObjectId, required: true },
    topicUniqueId: { type: String, required: true },
    question: { type: String, required: true },
    authorId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    upvotes: { type: [String], default: [] },
    answers: [AnswerSchema],
});

const Faq = mongoose.model<IFaq>('Faq', FaqSchema);

export default Faq;