
import { Document, Types } from "mongoose";

export interface ITopic extends Document {
    _id: Types.ObjectId;
    name: string;
    content: string;
    uniqueId?: string;
    contributorId: Types.ObjectId;
    tags: string[];
    children: ITopic[];
}

export interface IRoadmap extends Document {
    _id: Types.ObjectId;
    title: string;
    description: string;
    uniqueId?: string;
    type: 'expert_collaboration' | 'public_voting' | 'moderator_submission';
    tags: string[];
    members: Types.ObjectId[];
    creatorId: Types.ObjectId;
    topics: ITopic;
    createdAt: Date;
    updatedAt: Date;
}
