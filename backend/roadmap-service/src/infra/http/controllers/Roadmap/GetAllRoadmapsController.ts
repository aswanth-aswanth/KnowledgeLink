import { Request, Response } from "express";
import GetAllRoadmaps from "../../../../app/useCases/Roadmap/GetAllRoadmaps";
import RoadmapRepository from "../../../../app/repositories/RoadmapRepository";

export default class GetAllRoadmapsController {
    public async handle(req: Request, res: Response) {

        const getAllRoadmaps = new GetAllRoadmaps(
            new RoadmapRepository()
        );

        try {
            const roadmaps = await getAllRoadmaps.execute();
            return res.status(200).json(roadmaps);
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ error: err.message });
            }
            return res.status(400).json({ error: 'Unknown error' });
        }
    }
}