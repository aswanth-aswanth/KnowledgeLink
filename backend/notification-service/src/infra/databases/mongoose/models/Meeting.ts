// src/infra/databases/mongoose/models/Meeting.ts

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMeeting extends Document {
  meetingId: string;
  title: string;
  description: string;
  scheduledTime: Date;
  roomName: string;
  createdBy: string;
  invitedUsers: string[];
}

const meetingSchema = new Schema<IMeeting>({
  meetingId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  scheduledTime: { type: Date, required: true },
  roomName: { type: String, required: true },
  createdBy: { type: String, required: true },
  invitedUsers: [{ type: String }]
}, {
  timestamps: true
});

const Meeting: Model<IMeeting> = mongoose.model<IMeeting>('Meeting', meetingSchema);

export default Meeting;