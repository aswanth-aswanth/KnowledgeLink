import { Request, Response } from "express";
import MergeContribution from "../../../../app/useCases/Roadmap/MergeContribution";
import RoadmapRepository from "../../../../app/repositories/RoadmapRepository";

export default class MergeContributionController {
    public async handle(req: any, res: Response): Promise<Response> {
        const roadmapId = req.params.id;
        const { contributorEmail, contributedDocument } = req.body;
        const email = req.user.email;

        try {
            const mergeContribution = new MergeContribution(
                new RoadmapRepository()
            );
            await mergeContribution.mergeContribution(email, roadmapId, contributorEmail, contributedDocument);
            return res.json({ message: "Contribution merged successfully" });
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ error: err.message || "Failed to merge contribution" });
            }
            return res.status(400).json({ error: "Unknown error" });
        }
    }
}
