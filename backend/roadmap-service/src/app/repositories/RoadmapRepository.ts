import Roadmap from "../../infra/databases/mongoose/models/Roadmap";
import RectanglesData from "../../infra/databases/mongoose/models/Rectangles";
import ConnectionsData from "../../infra/databases/mongoose/models/Connections";
import { IRoadmap, IRectanglesData, IConnectionsData } from "../../infra/databases/interfaces/IRoadmap";
import { Types } from "mongoose";

export default class RoadmapRepository {
    public async create(roadmap: IRoadmap, rectanglesData: IRectanglesData, connectionsData: IConnectionsData): Promise<IRoadmap> {
        try {
            const newRoadmap = new Roadmap(roadmap);
            const savedRoadmap = await newRoadmap.save();

            const newRectanglesData = new RectanglesData(rectanglesData);
            await newRectanglesData.save();

            const newConnectionsData = new ConnectionsData(connectionsData);
            await newConnectionsData.save();

            return savedRoadmap;
        } catch (error) {
            throw error;
        }
    }
    
    public async findRoadmapById(roadmapId: string): Promise<IRoadmap | null> {
        console.log("RoadmapId from repository : ", roadmapId);
        return await Roadmap.findById(roadmapId).exec();
    }
    public async findRoadmapsByIds(ids: string[]): Promise<IRoadmap[]> {
        return await Roadmap.find({ _id: { $in: ids } })
            .select('_id title description type')
            .exec();
    }
    public async findRoadmapsByType(type: string): Promise<IRoadmap[]> {
        return await Roadmap.find({ type: { $in: type } })
            .select('_id title description type')
            .exec();
    }
    public async findRoadmapsByAdmin(userId: string): Promise<IRoadmap[]> {
        return await Roadmap.find({ creatorId: userId })
            .select('_id title description type')
            .exec();
    }
    public async findRoadmapMembers(roadmapId: string): Promise<Types.ObjectId[]> {
        const roadmap = await Roadmap.findById(roadmapId).select('members').exec();
        return roadmap ? roadmap.members : [];
    }

    /* public async findRoadmapWithDetails(roadmapId: string): Promise<IRoadmap | null> {
        const roadmap = await Roadmap.findById(roadmapId).exec();
        if (!roadmap) return null;

        const rectanglesData = await RectanglesData.findOne({ roadmapUniqueId: roadmap.uniqueId }).exec();
        const connectionsData = await ConnectionsData.findOne({ roadmapUniqueId: roadmap.uniqueId }).exec();

        return {
            ...roadmap.toObject(),
            rectanglesData,
            connectionsData
        };
    } */
}