import Roadmap from "../../infra/databases/mongoose/models/Roadmap";
import { IRoadmap } from "../../infra/databases/interfaces/IRoadmap";

export default class RoadmapRepository {
    public async create(roadmap: IRoadmap): Promise<IRoadmap> {
        const newRoadmap = new Roadmap(roadmap);
        return newRoadmap.save();
    }
    public async findRoadmapById(roadmapId: string): Promise<IRoadmap | null> {
        console.log("RoadmapId from repository : ", roadmapId);
        return await Roadmap.findById(roadmapId).exec();
    }
}