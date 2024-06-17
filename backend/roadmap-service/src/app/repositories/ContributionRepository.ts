import Contribution from "../../infra/databases/mongoose/models/Contribution";
import { IContribution } from "../../infra/databases/interfaces/IContribution";

export default class ContributionRepository {
    public async create(contribution: IContribution): Promise<IContribution> {
        const newContribution = new Contribution(contribution);
        return newContribution.save();
    }
}