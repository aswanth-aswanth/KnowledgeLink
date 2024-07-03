import RoadmapRepository from "../../repositories/RoadmapRepository";
import Contribution from "../../../infra/databases/mongoose/models/Contribution"; // Make sure to import the Contribution model

export default class MergeContribution {
    private roadmapRepository: RoadmapRepository;

    constructor(roadmapRepository: RoadmapRepository) {
        this.roadmapRepository = roadmapRepository;
    }

    public async mergeContribution(userEmail: string, roadmapId: string, contributorEmail: string, contribution: { id: string, data: { content: string, tags?: string[] } }): Promise<void> {
        const { id, data } = contribution;
        console.log("roadmapId useCase : ", roadmapId);
        console.log("userEmail useCase : ", userEmail);
        console.log("contributorEmail useCase : ", contributorEmail);
        console.log("Merge contribution useCase : ", contribution);

        const roadmap = await this.roadmapRepository.findRoadmapById(roadmapId);
        if (roadmap?.creatorEmail !== userEmail) {
            throw new Error('Only the roadmap creator can merge contributions');
        }
        if (!roadmap) {
            throw new Error('Roadmap not found');
        }

        function updateTopic(topic: any, docId: string, newContent: string, contributorEmail: string, tags?: string[]): boolean {
            console.log(`Checking topic with uniqueId: ${topic.uniqueId}`);
            if (topic.uniqueId === docId) {
                console.log(`Found matching topic. Updating content.`);
                topic.content = newContent;
                topic.contributorEmail = contributorEmail;
                if (tags) {
                    topic.tags = tags;
                }
                return true;
            }
            let found = false;
            if (topic.children && topic.children.length > 0) {
                for (let i = 0; i < topic.children.length; i++) {
                    const child = topic.children[i];
                    if (updateTopic(child, docId, newContent, contributorEmail, tags)) {
                        found = true;
                        break;
                    }
                }
            }
            return found;
        }

        const docUpdated = updateTopic(roadmap.topics, id, data.content, contributorEmail, data.tags);
        if (!docUpdated) {
            throw new Error('Document to be updated not found');
        }

        await roadmap.save();

        // After successfully merging, update the Contribution document
        const updatedContribution = await Contribution.findOneAndUpdate(
            {
                roadmapId: roadmapId,
                contributorEmail: contributorEmail,
                'contributions.id': id
            },
            { $set: { isMerged: true } },
            { new: true }
        );

        if (!updatedContribution) {
            console.warn('Contribution document not found or not updated');
        }
    }
}