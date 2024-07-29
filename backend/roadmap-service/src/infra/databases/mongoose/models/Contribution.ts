import mongoose, { Schema, Document, Types } from "mongoose";
import { IContribution } from '../../interfaces/IContribution';

const ContributionSchema: Schema<IContribution> = new Schema({
    roadmapId: { type: String, required: true },
    contributedDocumentIds: [{ type: String }],
    contributorId: { type: String },
    contributions: [{
        id: { type: String },
        content: { type: Object },
        isMerged: { type: Boolean, default: false }
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    isFullyMerged: { type: Boolean, default: false }
});

ContributionSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

const Contribution = mongoose.model<IContribution>('Contribution', ContributionSchema);

export default Contribution;