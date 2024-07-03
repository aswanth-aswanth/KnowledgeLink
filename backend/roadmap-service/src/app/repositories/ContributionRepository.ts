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
            console.error(error);
            return false;
        }
    };

    public async create(contribution: IContribution): Promise<string> {
        const canContribute = await this.checkUserContributionPermission(contribution.roadmapId, contribution.contributorEmail);

        if (!canContribute) {
            throw new Error('User is not allowed to contribute to this roadmap');
        }

        const newContribution = new Contribution(contribution);
        await newContribution.save();
        return "Successfully contributed";
    }

    public async getContributionsByRoadmapId(roadmapId: string): Promise<IContribution[]> {
        const data = await Contribution.find({ roadmapId, isMerged: false }).exec();
        return data;
    }

}
