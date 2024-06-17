
import { IContribution } from "../../../../infra/databases/interfaces/IContribution";
import ContributionRepository from "../../../repositories/ContributionRepository";

export default class ContributeRoadmap {
    private contributionRepository: ContributionRepository;
    constructor(contributionRepository: ContributionRepository) {
        this.contributionRepository = contributionRepository;
    }

    public async execute(contributionData: IContribution): Promise<IContribution> {
        const contribution = await this.contributionRepository.create(contributionData);
        return contribution;
    }
}