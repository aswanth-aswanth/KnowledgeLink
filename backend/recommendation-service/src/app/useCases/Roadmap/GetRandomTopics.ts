import RoadmapRepository from "../../repositories/RoadmapRepository";
import { ITopic } from "../../../infra/databases/interfaces/IRoadmap";
import { Types } from "mongoose";

export default class GetRandomTopics {
    private roadmapRepository: RoadmapRepository;

    constructor(
        roadmapRepository: RoadmapRepository
    ) {
        this.roadmapRepository = roadmapRepository;
    }

    public async execute(count: number): Promise<any[]> {
        try {
            const roadmaps = await this.roadmapRepository.findAllRoadmaps();
            const allTopics: any[] = [];

            roadmaps.forEach(roadmap => {
                const flattenedTopics = this.flattenTopics(roadmap.topics, roadmap._id, roadmap.title);
                allTopics.push(...flattenedTopics);
            });

            return this.getRandomTopics(allTopics, count);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error("Failed to get random topics: " + error.message);
            }
            throw new Error("Unknown error ");
        }
    }

    private flattenTopics(topic: ITopic, roadmapId: Types.ObjectId, roadmapTitle: string): any[] {
        let flattened: any[] = [this.addRoadmapIdToTopic(topic, roadmapId, roadmapTitle)];

        if (topic.children && topic.children.length > 0) {
            for (let child of topic.children) {
                flattened = flattened.concat(this.flattenTopics(child, roadmapId, roadmapTitle));
            }
        }

        return flattened;
    }

    private addRoadmapIdToTopic(topic: ITopic, roadmapId: Types.ObjectId, roadmapTitle: string): any {
        return {
            _id: topic._id,
            name: topic.name,
            content: topic.content,
            uniqueId: topic.uniqueId,
            contributorId: topic.contributorId,
            tags: topic.tags,
            likes: topic.likes,
            roadmapId: roadmapId,
            roadmapTitle: roadmapTitle
        };
    }

    private getRandomTopics(allTopics: any[], count: number): any[] {
        const selectedTopics: any[] = [];
        const usedRoadmaps = new Set<string>();

        while (selectedTopics.length < count && allTopics.length > 0) {
            const randomIndex = Math.floor(Math.random() * allTopics.length);
            const topic = allTopics[randomIndex];

            if (!usedRoadmaps.has(topic.roadmapId!.toString()) || usedRoadmaps.size >= allTopics.length) {
                selectedTopics.push(topic);
                usedRoadmaps.add(topic.roadmapId!.toString());
            }

            allTopics.splice(randomIndex, 1);
        }

        return selectedTopics;
    }
}
