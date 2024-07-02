import mongoose, { Schema, Document, Types } from "mongoose";
import { IContribution } from '../../interfaces/IContribution';



const ContributionSchema: Schema<IContribution> = new Schema({
    roadmapId: { type: String, required: true },
    contributedDocumentIds: [{ type: String }],
    contributorEmail: { type: String },
    contributions: [{ type: Object }],
    createdAt: Date,
    updatedAt: Date
});

const Contribution = mongoose.model<IContribution>('Contribution', ContributionSchema);

export default Contribution;
