import RoadmapRepository from "../../repositories/RoadmapRepository";
import { IRoadmap } from "../../../infra/databases/interfaces/IRoadmap";

export default class GetRoadmapsByMember {
    private roadmapRepository: RoadmapRepository;

    constructor(
        roadmapRepository: RoadmapRepository,
    ) {
        this.roadmapRepository = roadmapRepository;
    }

    public async execute(userId: string): Promise<any> {
        try {
            console.log("userId member roadmap : ", userId);
            const roadmaps = await this.roadmapRepository.getRoadmapsByMember(userId);
            console.log("userId member roadmaps : ", roadmaps);
            if (roadmaps.length === 0) {
                return [];
            }

            return roadmaps;
        } catch (error) {
            if (error instanceof Error)
                throw new Error("Failed to get roadmap members: " + error.message);
            throw new Error("Unknown error ");
        }
    }
}
