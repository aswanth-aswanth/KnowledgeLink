import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
    username: string;
    email: string;
    password?: string;
    favourites?: string[];
    subscribed?: string[];
    following?: string[];
    followers?: string[];
    image?: string;
}

const PostSchema: Schema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    image: { type: String, default: "" },
    favourites: { type: [String], default: [] },
    subscribed: { type: [String], default: [] },
    following: { type: [String], default: [] },
    followers: { type: [String], default: [] },
});

export default mongoose.model<IPost>('Post', PostSchema);
