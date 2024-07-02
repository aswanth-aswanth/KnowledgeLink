import Contribution from "../../infra/databases/mongoose/models/Contribution";
import { IContribution } from "../../infra/databases/interfaces/IContribution";

export default class ContributionRepository {
    public async create(contribution: IContribution): Promise<string> {
        const newContribution = new Contribution(contribution);
        newContribution.save();
        return "Successfully contributed";
    }

    public async getContributionsByRoadmapId(roadmapId: string): Promise<IContribution[]> {
        const data = await Contribution.find({ roadmapId }).exec();
        return data;
    }

}
