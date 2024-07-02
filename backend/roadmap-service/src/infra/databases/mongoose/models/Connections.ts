import mongoose from 'mongoose';
import { IConnectionsData } from '../../interfaces/IRoadmap';

const ConnectionsDataSchema = new mongoose.Schema<IConnectionsData>({
    roadmapUniqueId: { type: String, required: true, unique: true },
    connections: [{
        from: String,
        to: String,
        style: String,
    }]
});

export default mongoose.model<IConnectionsData>('ConnectionsData', ConnectionsDataSchema);