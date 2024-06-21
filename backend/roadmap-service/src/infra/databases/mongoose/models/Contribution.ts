import mongoose, { Schema, Document, Types } from "mongoose";
import { IContribution } from '../../interfaces/IContribution';



const ContributionSchema: Schema<IContribution> = new Schema({
    roadmapId: { type: String, required: true },
    contributedDocumentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Roadmap', required: true }],
    contributorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    contributions: [{ type: Object }],
    createdAt: Date,
    updatedAt: Date
});

const Contribution = mongoose.model<IContribution>('Contribution', ContributionSchema);

export default Contribution;
