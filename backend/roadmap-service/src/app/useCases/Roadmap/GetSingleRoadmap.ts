import RoadmapRepository from "../../repositories/RoadmapRepository";
import { IRoadmap } from "../../../infra/databases/interfaces/IRoadmap";

export default class GetSingleRoadmap {
    private roadmapRepository: RoadmapRepository;

    constructor(
        roadmapRepository: RoadmapRepository
    ) {
        this.roadmapRepository = roadmapRepository;
    }

    public async execute(roadmapId: string): Promise<IRoadmap> {
        console.log("roadmapId usecase : ", roadmapId);
        const roadmap = await this.roadmapRepository.findRoadmapById(roadmapId);
        console.log("roadmap after result : ",roadmap);
        if (!roadmap) {
            throw new Error('Roadmap not found');
        }
        return roadmap;
    }
}
