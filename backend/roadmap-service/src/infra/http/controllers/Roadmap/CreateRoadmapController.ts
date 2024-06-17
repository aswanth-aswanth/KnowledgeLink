import { Request, Response } from "express";
import CreateRoadmap from "../../../../app/useCases/Roadmap/Implementations/CreateRoadmap";
import RoadmapRepository from "../../../../app/repositories/RoadmapRepository"

export default class CreateRoadmapController {
    public async handle(req: Request, res: Response) {
        const roadmapData = req.body;
        const roadmap = new CreateRoadmap(
            new RoadmapRepository()
        );
        try {
            roadmap.execute(roadmapData);
            return res.json({ "message": "Roadmap created successfully" })
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ error: err.message });
            }
            return res.status(400).json({ error: 'Unknown error' });
        }

    }
}