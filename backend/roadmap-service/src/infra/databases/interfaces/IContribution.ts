import { Document } from 'mongoose';

interface IContribution extends Document {
  roadmapId: string;
  contributorEmail: string;
  contributedDocumentIds: string[],
  contributions: object[],
  createdAt: Date;
  updatedAt: Date;
}

export { IContribution };