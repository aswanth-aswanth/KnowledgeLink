import { Request, Response } from "express";
import CreateRoadmap from "../../../../app/useCases/Roadmap/CreateRoadmap";
import RoadmapRepository from "../../../../app/repositories/RoadmapRepository"

export default class CreateRoadmapController {
    public async handle(req: any, res: any) {
        console.log("req.user : ", req.user);
        console.log("req.body : ", req.body);
        const { editorData, rectanglesData, connectionsData } = req.body;
        const roadmapData = {
            ...editorData,
            creatorEmail: req.user.email,
        };
        const roadmap = new CreateRoadmap(
            new RoadmapRepository()
        );
        try {
            const createdRoadmap = await roadmap.execute(roadmapData, rectanglesData, connectionsData);
            return res.status(201).json({
                message: "Roadmap created successfully",
                roadmapId: createdRoadmap._id
            });
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ error: err.message });
            }
            return res.status(500).json({ error: 'Unknown error' });
        }
    }
}