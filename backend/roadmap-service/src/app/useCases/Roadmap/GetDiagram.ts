import RoadmapRepository from "../../repositories/RoadmapRepository";

export default class GetDiagram {
    private roadmapRepository: RoadmapRepository;

    constructor(
        roadmapRepository: RoadmapRepository
    ) {
        this.roadmapRepository = roadmapRepository;
    }

    public async execute(roadmapId: string): Promise<[any, any]> {
        const rectangles = await this.roadmapRepository.findRectanglesByRoadmapId(roadmapId);
        const connections = await this.roadmapRepository.findConnectionsByRoadmapId(roadmapId);
        return [rectangles, connections]
    }
}
