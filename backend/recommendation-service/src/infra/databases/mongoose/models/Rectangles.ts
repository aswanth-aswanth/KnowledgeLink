import mongoose from 'mongoose';
import { IRectanglesData } from '../../interfaces/IRoadmap';

const RectanglesDataSchema = new mongoose.Schema<IRectanglesData>({
    roadmapUniqueId: { type: String, required: true, unique: true },
    rectangles: [{
        id: String,
        x: Number,
        y: Number,
        width: Number,
        height: Number,
        name: String,
        uniqueId: String,
    }]
});

export default mongoose.model<IRectanglesData>('RectanglesData', RectanglesDataSchema);