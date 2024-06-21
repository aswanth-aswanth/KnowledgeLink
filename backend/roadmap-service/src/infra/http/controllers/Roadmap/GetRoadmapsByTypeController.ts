import { Request, Response } from "express";
import GetRoadmapsByType from "../../../../app/useCases/Roadmap/GetRoadmapsByType";
import RoadmapRepository from "../../../../app/repositories/RoadmapRepository";

export default class GetRoadmapsByTypeController {
    public async handle(req: Request, res: Response) {

        const roadmapType = req.query.type as string;

        const getRoadmapsByType = new GetRoadmapsByType(
            new RoadmapRepository()
        );

        try {
            const roadmaps = await getRoadmapsByType.execute(roadmapType);
            return res.status(200).json(roadmaps);
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ error: err.message });
            }
            return res.status(400).json({ error: 'Unknown error' });
        }
    }
}