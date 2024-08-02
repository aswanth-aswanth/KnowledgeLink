import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  password?: string;
  favourites: string[];
  subscribed: string[];
  image: string;
  isPassportVerified: boolean;
  role?: string;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  favourites: { type: Array, default: [] },
  subscribed: { type: Array, default: [] },
  image: { type: String },
  isPassportVerified: { type: Boolean, default: false }
});

export default mongoose.model<IUser>('User', UserSchema);
