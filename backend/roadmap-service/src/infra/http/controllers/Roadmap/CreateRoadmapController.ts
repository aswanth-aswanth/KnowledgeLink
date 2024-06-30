import { Request, Response } from "express";
import CreateRoadmap from "../../../../app/useCases/Roadmap/CreateRoadmap";
import RoadmapRepository from "../../../../app/repositories/RoadmapRepository"

export default class CreateRoadmapController {
    public async handle(req: any, res: any) {
        console.log("req.user : ", req.user);
        console.log("req.body : ", req.body);
        const roadmapData = { ...req.body, creatorId: req.user.userId };
        const roadmap = new CreateRoadmap(
            new RoadmapRepository()
        );
        try {
            roadmap.execute(roadmapData);
            return res.status(201).json({ "message": "Roadmap created successfully" })
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ error: err.message });
            }
            return res.status(400).json({ error: 'Unknown error' });
        }

    }
}