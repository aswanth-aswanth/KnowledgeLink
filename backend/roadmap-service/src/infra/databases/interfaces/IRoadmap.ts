
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
    members: string[];
    creatorId: Types.ObjectId;
    topics: ITopic;
    createdAt: Date;
    updatedAt: Date;
}


export interface IRectangle {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    name: string;
    uniqueId: string;
}
export interface IConnection {
    from: string;
    to: string;
    style: string;
}
export interface IRectanglesData {
    roadmapUniqueId: string;
    rectangles: IRectangle[];
}

export interface IConnectionsData {
    roadmapUniqueId: string;
    connections: IConnection[];
}

