// src/infra/databases/interfaces/IFaq.ts

import { Document, Types } from "mongoose";

export interface IAnswer {
  _id: Types.ObjectId;
  content: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  upvotes: string[];
}

export interface IFaq extends Document {
  roadmapId: Types.ObjectId;
  topicId: Types.ObjectId;
  topicUniqueId: string;
  question: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  upvotes: string[];
  answers: IAnswer[];
}