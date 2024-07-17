import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  _id?: string;
  username: string;
  email: string;
  image: string;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String, default: "" },
});

export default mongoose.model<IUser>('User', UserSchema);
