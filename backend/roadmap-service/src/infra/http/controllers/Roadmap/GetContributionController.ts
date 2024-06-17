import { Request, Response } from "express";
import GetContributionsByRoadmap from "../../../../app/useCases/Roadmap/Implementations/GetContributionsByRoadmap";
import ContributionRepository from "../../../../app/repositories/ContributionRepository";
import RoadmapRepository from "../../../../app/repositories/RoadmapRepository";

export default class GetContributionController {
    public async handle(req: Request, res: Response) {
        const { id } = req.params;
        const userId = "60d9f8f8f8f8f8f8f8f8f8f9";

        const getContributions = new GetContributionsByRoadmap(
            new ContributionRepository(),
            new RoadmapRepository()
        );

        try {
            const contributions = await getContributions.execute(id, userId);
            return res.json(contributions);
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ error: err.message });
            }
            return res.status(400).json({ error: 'Unknown error' });
        }
    }
}