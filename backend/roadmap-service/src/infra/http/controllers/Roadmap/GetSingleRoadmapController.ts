import { Request, Response } from "express";
import GetSingleRoadmap from "../../../../app/useCases/Roadmap/GetSingleRoadmap";
import RoadmapRepository from "../../../../app/repositories/RoadmapRepository";

export default class GetSingleRoadmapController {
    public async handle(req: Request, res: Response) {
        const { id } = req.params;
        const userId = "60d9f8f8f8f8f8f8f8f8f8f9";

        const getSingleRoadmap = new GetSingleRoadmap(
            new RoadmapRepository()
        );

        try {
            const contributions = await getSingleRoadmap.execute(id);
            return res.json(contributions);
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ error: err.message });
            }
            return res.status(400).json({ error: 'Unknown error' });
        }
    }
}