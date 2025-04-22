import mongoose, { Schema } from "mongoose";
import { IRoadmap, ITopic } from "../../interfaces/IRoadmap";

// Recursive Topic schema to allow arbitrary nesting
const TopicSchema = new Schema<ITopic>({
  _id: { type: Schema.Types.ObjectId, auto: true },
  name: { type: String, required: true },
  uniqueId: { type: String },
  content: { type: Schema.Types.Mixed, default: {} },
  contributorId: { type: String, default: "" },
  tags: { type: [String], default: [] },
  likes: { type: [String], default: [] },
  // `children` will be added recursively below
  children: [] as unknown[],
});

// Embed TopicSchema into its own `children` field for recursion
TopicSchema.add({ children: [TopicSchema] });

// Roadmap schema
const RoadmapSchema = new Schema<IRoadmap>(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    type: {
      type: String,
      enum: ["expert_collaboration", "public_voting", "moderator_submission"],
      required: true,
    },
    tags: { type: [String], default: [] },
    uniqueId: { type: String },
    members: { type: [String], default: [] },
    creatorId: { type: String, required: true },

    // Embed the recursive TopicSchema
    topics: { type: TopicSchema, required: true },

    media: [
      {
        type: { type: String },
        url: { type: String },
        topicId: { type: String },
      },
    ],
  },
  { timestamps: true }
);

// Create and export the model
export default mongoose.model<IRoadmap>("Roadmap", RoadmapSchema);
