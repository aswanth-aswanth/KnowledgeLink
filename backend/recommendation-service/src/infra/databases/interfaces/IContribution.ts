import { Document } from 'mongoose';

interface IContribution extends Document {
  roadmapId: string;
  contributorId: string;
  contributedDocumentIds: string[],
  contributions: object[],
  createdAt: Date;
  updatedAt: Date;
  isMerged: Boolean;
}

export { IContribution };