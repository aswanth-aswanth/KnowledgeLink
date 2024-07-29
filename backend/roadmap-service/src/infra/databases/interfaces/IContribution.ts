import { Document } from 'mongoose';

interface IContribution extends Document {
  roadmapId: string;
  contributorId: string;
  contributedDocumentIds: string[];
  contributions: {
    id: string;
    content: object;
    isMerged: boolean;
  }[];
  createdAt: Date;
  updatedAt: Date;
  isFullyMerged: boolean;
}

export { IContribution };