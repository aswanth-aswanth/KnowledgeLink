import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  _id?: string;
  username: string;
  email: string;
  password?: string;
  bio?: string;
  favourites?: string[];
  subscribed?: string[];
  following?: string[];
  followers?: string[];
  image?: string;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  bio: { type: String, default: "" },
  image: { type: String, default: "" },
  favourites: { type: [String], default: [] },
  subscribed: { type: [String], default: [] },
  following: { type: [String], default: [] },
  followers: { type: [String], default: [] },
});

export default mongoose.model<IUser>('User', UserSchema);
