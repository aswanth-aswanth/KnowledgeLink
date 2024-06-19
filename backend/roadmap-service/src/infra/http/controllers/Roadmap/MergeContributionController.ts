import { Request, Response } from "express";
import MergeContribution from "../../../../app/useCases/Roadmap/MergeContribution";
import RoadmapRepository from "../../../../app/repositories/RoadmapRepository";

export default class MergeContributionController {
    public async handle(req: Request, res: Response): Promise<Response> {
        const roadmapId = req.params.id;
        const { contributorId, contributedDocument } = req.body;
        const userId = "3l232lk";

        try {
            const mergeContribution = new MergeContribution(
                new RoadmapRepository()
            );
            await mergeContribution.mergeContribution(roadmapId, contributorId, contributedDocument);
            return res.json({ message: "Contribution merged successfully" });
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ error: err.message || "Failed to merge contribution" });
            }
            return res.status(400).json({ error: "Unknown error" });
        }
    }
}