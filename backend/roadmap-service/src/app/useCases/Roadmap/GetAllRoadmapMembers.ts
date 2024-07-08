import RoadmapRepository from "../../repositories/RoadmapRepository";
import Publisher from "../../../infra/messaging/rabbitmq/Publisher";
import { IRoadmap } from "../../../infra/databases/interfaces/IRoadmap";

export default class GetAllRoadmapMembers {
    private roadmapRepository: RoadmapRepository;

    constructor(
        roadmapRepository: RoadmapRepository,
    ) {
        this.roadmapRepository = roadmapRepository;
    }

    public async execute(roadmapId: string): Promise<any> {
        try {
            const members = await this.roadmapRepository.findRoadmapMembers(roadmapId);
            if (members.length === 0) {
                return [];
            }

            const message = JSON.stringify({ members });
            const response = await Publisher.publishAndWait('profile_service_queue', message);

            return JSON.parse(response);
        } catch (error) {
            if (error instanceof Error)
                throw new Error("Failed to get roadmap members: " + error.message);
            throw new Error("Unknown error ");
        }
    }
}
