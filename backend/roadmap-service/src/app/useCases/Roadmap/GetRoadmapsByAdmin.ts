import RoadmapRepository from "../../repositories/RoadmapRepository";
import { IRoadmap } from "../../../infra/databases/interfaces/IRoadmap";

export default class GetRoadmapsByAdmin {
    private roadmapRepository: RoadmapRepository;

    constructor(
        roadmapRepository: RoadmapRepository
    ) {
        this.roadmapRepository = roadmapRepository;
    }

    public async execute(userId: string): Promise<IRoadmap[]> {
        try {
            const roadmaps = await this.roadmapRepository.findRoadmapsByAdmin(userId);
            console.log("Admin roadmaps : ", roadmaps);
            return roadmaps;
        } catch (error) {
            if (error instanceof Error)
                throw new Error("Failed to get roadmaps: " + error.message);
            throw new Error("Unknown error ");
        }
    }
}
