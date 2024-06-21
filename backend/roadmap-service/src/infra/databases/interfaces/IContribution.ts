import { Document, Types } from 'mongoose';

interface IContribution extends Document {
  roadmapId: string;
  contributorId: Types.ObjectId;
  contributedDocumentIds: Types.ObjectId[],
  contributions: object[],
  createdAt: Date;
  updatedAt: Date;
}

export { IContribution };