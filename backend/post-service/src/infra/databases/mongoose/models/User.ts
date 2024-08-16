// src/infra/databases/mongoose/models/User.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  image: string;
  likedShorts: string[];
  viewedShorts: string[];
  shortPreferences: {
    [tag: string]: number;
  };
}

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  image: {
    type: String,
    required: false
  },
  likedShorts: [{
    type: Schema.Types.ObjectId,
    ref: 'Short'
  }],
  viewedShorts: [{
    type: Schema.Types.ObjectId,
    ref: 'Short'
  }],
  shortPreferences: {
    type: Map,
    of: Number,
    default: {}
  }
});

const User = mongoose.model<IUser>('User', UserSchema);
export default User;