import ContributionRepository from "../../../repositories/ContributionRepository";
import RoadmapRepository from "../../../repositories/RoadmapRepository";
import { IContribution } from "../../../../infra/databases/interfaces/IContribution";

export default class GetContributionsByRoadmap {
    private contributionRepository: ContributionRepository;
    private roadmapRepository: RoadmapRepository;

    constructor(
        contributionRepository: ContributionRepository,
        roadmapRepository: RoadmapRepository
    ) {
        this.contributionRepository = contributionRepository;
        this.roadmapRepository = roadmapRepository;
    }

    public async execute(roadmapId: string, userId: string): Promise<IContribution[]> {
        const roadmap = await this.roadmapRepository.findRoadmapById(roadmapId);
        if (!roadmap) {
            throw new Error('Roadmap not found');
        }

        if (roadmap.creatorId.toString() !== userId) {
            throw new Error('Unauthorized access');
        }
        return this.contributionRepository.getContributionsByRoadmapId(roadmapId);
    }
}
