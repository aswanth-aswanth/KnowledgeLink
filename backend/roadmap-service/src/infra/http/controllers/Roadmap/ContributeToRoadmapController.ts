import { Request, Response } from "express";
import ContributeRoadmap from "../../../../app/useCases/Roadmap/Implementations/ContributeRoadmap";
import ContributionRepository from "../../../../app/repositories/ContributionRepository";

export default class ContributeToRoadmapController {
    public async handle(req: Request, res: Response) {
        const contributionData = {
            roadmapId: req.params.id,
            ...req.body
        };
        const contributions = new ContributeRoadmap(
            new ContributionRepository()
        );

        try {
            contributions.execute(contributionData);
            return res.json({ "message": "Contributed successfully" })
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ error: err.message });
            }
            return res.status(400).json({ error: 'Unknown error' });
        }
    }
}