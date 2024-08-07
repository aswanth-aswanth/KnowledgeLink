import { Document, Types } from "mongoose";

export interface IAnswer extends Document {
    _id: Types.ObjectId;
    content: string;
    contributorId: string;
    likes: string[];
    upvotes: string[];
    createdAt: Date;
}

export interface AddFaqQuestionDTO {
    roadmapId: Types.ObjectId;
    topicId: Types.ObjectId;
    topicUniqueId: string;
    question: string;
    contributorId: string;
}

export interface IFAQ extends Document {
    _id: Types.ObjectId;
    roadmapId: Types.ObjectId;
    topicId: Types.ObjectId;
    topicUniqueId: string;
    question: string;
    contributorId: string;
    likes: string[];
    upvotes: string[];
    answers: IAnswer[];
    createdAt: Date;
}
