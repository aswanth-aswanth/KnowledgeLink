import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string,
  email: string;
  password?: string;
  favourites?: string[],
  subscribed?: string[],
  image?: string
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  image: { type: String, default: "" },
  favourites: { type: Array, default: [] },
  subscribed: { type: Array, default: [] }
});

export default mongoose.model<IUser>('User', UserSchema);
