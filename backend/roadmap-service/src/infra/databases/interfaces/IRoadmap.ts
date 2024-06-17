import { Document, Types } from 'mongoose';

interface ITopic {
    name: string;
    content: string;
    children?: ITopic[];
}

interface IRoadmap extends Document {
    title: string;
    description: string;
    type: 'expert_collaboration' | 'public_voting' | 'moderator_submission';
    tags: string[];
    members: Types.ObjectId[];
    creatorId: Types.ObjectId;
    topics: ITopic;
    createdAt: Date;
    updatedAt: Date;
}

export { ITopic, IRoadmap };
