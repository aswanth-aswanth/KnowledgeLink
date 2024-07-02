import ContributionRepository from "../../repositories/ContributionRepository";
import { IContribution } from "../../../infra/databases/interfaces/IContribution";

export default class ContributeRoadmap {
    private contributionRepository: ContributionRepository;

    constructor(contributionRepository: ContributionRepository) {
        this.contributionRepository = contributionRepository;
    }

    public async execute(contributionData: IContribution): Promise<string> {
        const contribution = await this.contributionRepository.create(contributionData);
        return contribution;
    }
}
