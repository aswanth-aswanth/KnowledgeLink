// src/infra/databases/mongoose/models/ExtractedData.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IExtractedData extends Document {
  roadmapId: mongoose.Types.ObjectId;
  topicId: mongoose.Types.ObjectId;
  uniqueId: string;
  name: string;
  summary: string;
  tags: string[];
  entities: Array<{ name: string; count: number }>;
  nounPhrases: string[];
  verbs: string[];
  readabilityMetrics: {
    wordCount: number;
    sentenceCount: number;
    avgWordsPerSentence: number;
    syllableCount: number;
    fleschKincaidReadability: number;
  };
  dates: Array<{
    text: string;
    start: { word: number; sentence: number };
    end: { word: number; sentence: number };
    date: Date;
  }>;
  topics: Array<{ term: string; score: number }>;
  contentLength: number;
  paragraphCount: number;
  sentiment: number;
  questionCount: number;
  exclamationCount: number;
  hasCode: boolean;
  headings: string[];
  links: Array<{ text: string; url: string }>;
  languageDetection: string[];
}

const ExtractedDataSchema: Schema = new Schema({
  roadmapId: { type: Schema.Types.ObjectId, ref: 'Roadmap', required: true },
  topicId: { type: Schema.Types.ObjectId, required: true },
  uniqueId: { type: String, required: true },
  name: { type: String, required: true },
  summary: { type: String },
  tags: [String],
  entities: [{ name: String, count: Number }],
  nounPhrases: [String],
  verbs: [String],
  readabilityMetrics: {
    wordCount: Number,
    sentenceCount: Number,
    avgWordsPerSentence: Number,
    syllableCount: Number,
    fleschKincaidReadability: Number,
  },
  dates: [{
    text: String,
    start: { word: Number, sentence: Number },
    end: { word: Number, sentence: Number },
    date: Date,
  }],
  topics: [{ term: String, score: Number }],
  contentLength: Number,
  paragraphCount: Number,
  sentiment: Number,
  questionCount: Number,
  exclamationCount: Number,
  hasCode: Boolean,
  headings: [String],
  links: [{ text: String, url: String }],
  languageDetection: [String],
});

export default mongoose.model<IExtractedData>('ExtractedData', ExtractedDataSchema);