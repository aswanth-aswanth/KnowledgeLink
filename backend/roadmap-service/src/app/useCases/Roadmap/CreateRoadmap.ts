import RoadmapRepository from "../../repositories/RoadmapRepository";
import { IRoadmap, IRectanglesData, IConnectionsData } from "../../../infra/databases/interfaces/IRoadmap";
import { File as FormidableFile } from 'formidable';
import Publisher from '../../../infra/messaging/rabbitmq/Publisher';

export default class CreateRoadmap {
    private roadmapRepository: RoadmapRepository;

    constructor(roadmapRepository: RoadmapRepository) {
        this.roadmapRepository = roadmapRepository;
    }

    public async execute(
        roadmapData: IRoadmap,
        rectanglesData: IRectanglesData,
        connectionsData: IConnectionsData,
        files: FormidableFile[]
    ): Promise<IRoadmap> {
        const roadmap = await this.roadmapRepository.create(roadmapData, rectanglesData, connectionsData, files);

        await this.sendToRecommendationService(roadmap);

        return roadmap;
    }

    private async sendToRecommendationService(roadmap: IRoadmap) {
        try {
            const message = JSON.stringify(roadmap);
            await Publisher.publish('recommendation_queue', message);
            console.log('Roadmap sent to recommendation service');
        } catch (error) {
            console.error('Failed to send roadmap to recommendation service:', error);
        }
    }
}