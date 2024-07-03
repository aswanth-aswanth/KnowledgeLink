import Contribution from "../../infra/databases/mongoose/models/Contribution";
import Roadmap from "../../infra/databases/mongoose/models/Roadmap";
import { IContribution } from "../../infra/databases/interfaces/IContribution";

export default class ContributionRepository {
    public async checkUserContributionPermission(roadmapId: string, userEmail: string): Promise<boolean> {
        try {
            const roadmap = await Roadmap.findById(roadmapId).exec();

            if (!roadmap) {
                throw new Error('Roadmap not found');
            }

            if (roadmap.type === 'public_voting') {
                return true; // Public collaboration, allow contribution
            } else {
                // Check if user is a member of the roadmap
                return roadmap.members.includes(userEmail);
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error checking user contribution permission: ${error.message}`);
                throw new Error('Failed to check user contribution permission');
            } else {
                console.error('Unknown error checking user contribution permission');
                throw new Error('Unknown error');
            }
        }
    }

    public async create(contribution: IContribution): Promise<string> {
        try {
            const canContribute = await this.checkUserContributionPermission(contribution.roadmapId, contribution.contributorEmail);

            if (!canContribute) {
                throw new Error('User is not allowed to contribute to this roadmap');
            }

            const newContribution = new Contribution(contribution);
            await newContribution.save();
            return "Successfully contributed";
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error creating contribution: ${error.message}`);
                throw new Error('Failed to create contribution');
            } else {
                console.error('Unknown error creating contribution');
                throw new Error('Unknown error');
            }
        }
    }

    public async getContributionsByRoadmapId(roadmapId: string): Promise<IContribution[]> {
        try {
            const data = await Contribution.find({ roadmapId, isMerged: false }).exec();
            return data;
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error fetching contributions for roadmapId ${roadmapId}: ${error.message}`);
                throw new Error('Failed to fetch contributions');
            } else {
                console.error('Unknown error fetching contributions');
                throw new Error('Unknown error');
            }
        }
    }
}
