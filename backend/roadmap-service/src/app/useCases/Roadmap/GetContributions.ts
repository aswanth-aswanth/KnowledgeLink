
// import { IContribution } from "../../../infra/databases/interfaces/IContribution";
// import ContributionRepository from "../../repositories/ContributionRepository";

// export default class GetContributions {
//     private contributionRepository: ContributionRepository;
//     constructor(contributionRepository: ContributionRepository) {
//         this.contributionRepository = contributionRepository;
//     }

//     public async execute(userId: string): Promise<IContribution> {
//         const contribution = await this.contributionRepository.create(userId);
//         return contribution;
//     }
// }