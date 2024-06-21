import RoadmapRepository from "../../repositories/RoadmapRepository";
import { IRoadmap } from "../../../infra/databases/interfaces/IRoadmap";

export default class CreateRoadmap {
    private roadmapRepository: RoadmapRepository;
    constructor(roadmapRepository: RoadmapRepository) {
        this.roadmapRepository = roadmapRepository;
    }
    public async execute(roadmapData: IRoadmap): Promise<IRoadmap> {
        const roadmap = await this.roadmapRepository.create(roadmapData);
        return roadmap;
    }
}