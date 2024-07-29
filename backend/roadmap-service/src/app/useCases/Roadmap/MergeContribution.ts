import RoadmapRepository from "../../repositories/RoadmapRepository";
import Contribution from "../../../infra/databases/mongoose/models/Contribution";

export default class MergeContribution {
    private roadmapRepository: RoadmapRepository;

    constructor(roadmapRepository: RoadmapRepository) {
        this.roadmapRepository = roadmapRepository;
    }

    public async mergeContribution(userId: string, roadmapId: string, contributorId: string, contribution: { id: string, data: { content: string, tags?: string[] } }): Promise<void> {
        const { id, data } = contribution;
        console.log("roadmapId useCase : ", roadmapId);
        console.log("userEmail useCase : ", userId);
        console.log("contributorEmail useCase : ", contributorId);
        console.log("Merge contribution useCase : ", contribution);

        const roadmap = await this.roadmapRepository.findRoadmapById(roadmapId);
        if (roadmap?.creatorId !== userId) {
            throw new Error('Only the roadmap creator can merge contributions');
        }
        if (!roadmap) {
            throw new Error('Roadmap not found');
        }

        function updateTopic(topic: any, docId: string, newContent: string, contributorId: string, tags?: string[]): boolean {
            console.log(`Checking topic with uniqueId: ${topic.uniqueId}`);
            if (topic.uniqueId === docId) {
                console.log(`Found matching topic. Updating content.`);
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

        // Find all contributions for this roadmap and contributorId
        const contributions = await Contribution.find({
            roadmapId: roadmapId,
            contributorId: contributorId,
            'contributions.id': id
        });

        for (const contribution of contributions) {
            const updatedContribution = await Contribution.findOneAndUpdate(
                {
                    _id: contribution._id,
                    'contributions.id': id
                },
                {
                    $set: {
                        'contributions.$.isMerged': true
                    }
                },
                { new: true }
            );

            if (updatedContribution) {
                // Check if all contributions in this document are merged
                const allMerged = updatedContribution.contributions.every(cont => cont.isMerged);

                if (allMerged) {
                    // If all contributions are merged, set isFullyMerged to true
                    await Contribution.findByIdAndUpdate(
                        updatedContribution._id,
                        { $set: { isFullyMerged: true } }
                    );
                }
            }
        }
    }
}