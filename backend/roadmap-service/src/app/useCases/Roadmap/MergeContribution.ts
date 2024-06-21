import RoadmapRepository from "../../repositories/RoadmapRepository";
import { Types } from "mongoose";

export default class MergeContribution {
    private roadmapRepository: RoadmapRepository;

    constructor(
        roadmapRepository: RoadmapRepository
    ) {
        this.roadmapRepository = roadmapRepository;
    }

    public async mergeContribution(roadmapId: string, contributorId: string, contribution: { id: Types.ObjectId, data: { content: string, tags?: string[] } }): Promise<void> {
        const { id, data } = contribution;

        const roadmap = await this.roadmapRepository.findRoadmapById(roadmapId);
        if (!roadmap) {
            throw new Error('Roadmap not found');
        }

        function updateTopic(topic: any, docId: Types.ObjectId, newContent: string, contributorId: string, tags?: string[]): boolean {
            if (topic._id.equals(docId)) {
                topic.content = newContent;
                topic.contributorId = contributorId;
                if (tags) {
                    topic.tags = tags;
                }
                return true;
            }
            let found = false;
            if (topic.children && topic.children.length > 0) {
                for (let i = 0; i < topic.children.length; i++) {
                    const child = topic.children[i];
                    if (updateTopic(child, docId, newContent, contributorId, tags)) {
                        found = true;
                        break;
                    }
                }
            }
            return found;
        }

        const docUpdated = updateTopic(roadmap.topics, id, data.content, contributorId, data.tags);
        if (!docUpdated) {
            throw new Error('Document to be updated not found');
        }

        await roadmap.save();
    }
}
