import RoadmapRepository from "../../repositories/RoadmapRepository";
import { IRoadmap } from "../../../infra/databases/interfaces/IRoadmap";
import Publisher from "../../../infra/messaging/rabbitmq/Publisher";

export default class GetAllSubscribedRoadmaps {
    private roadmapRepository: RoadmapRepository;

    constructor(
        roadmapRepository: RoadmapRepository
    ) {
        this.roadmapRepository = roadmapRepository;
    }

    public async execute(email: string): Promise<IRoadmap[]> {
        try {
            const message = JSON.stringify({ email });
            const response = await Publisher.publishAndWait('profile_queue', message);
            const subscribedRoadmapIds = JSON.parse(response).subscribed;

            if (!Array.isArray(subscribedRoadmapIds)) {
                throw new Error('Invalid response format');
            }

            const roadmaps = await this.roadmapRepository.findRoadmapsByIds(subscribedRoadmapIds);
            return roadmaps;
        } catch (error) {
            if (error instanceof Error)
                throw new Error("Failed to get subscribed roadmaps: " + error.message);
            throw new Error("Unknown error ");
        }
    }
}
