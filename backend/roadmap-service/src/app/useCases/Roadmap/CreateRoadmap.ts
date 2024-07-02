import RoadmapRepository from "../../repositories/RoadmapRepository";
import { IRoadmap, IRectanglesData, IConnectionsData } from "../../../infra/databases/interfaces/IRoadmap";

export default class CreateRoadmap {
    private roadmapRepository: RoadmapRepository;
    constructor(roadmapRepository: RoadmapRepository) {
        this.roadmapRepository = roadmapRepository;
    }
    public async execute(roadmapData: IRoadmap, rectanglesData: IRectanglesData, connectionsData: IConnectionsData): Promise<IRoadmap> {
        const roadmap = await this.roadmapRepository.create(roadmapData, rectanglesData, connectionsData);
        return roadmap;
    }
}