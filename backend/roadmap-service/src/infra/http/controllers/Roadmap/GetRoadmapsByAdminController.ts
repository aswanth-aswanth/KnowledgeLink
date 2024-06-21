import { Request, Response } from "express";
import GetRoadmapsByAdmin from "../../../../app/useCases/Roadmap/GetRoadmapsByAdmin";
import RoadmapRepository from "../../../../app/repositories/RoadmapRepository";

export default class GetRoadmapsByAdminController {
    public async handle(req: Request, res: Response) {

        const userId = "60d9f8f8f8f8f8f8f8f8f8f9";

        const getRoadmapsByAdmin = new GetRoadmapsByAdmin(
            new RoadmapRepository()
        );

        try {
            const roadmaps = await getRoadmapsByAdmin.execute(userId);
            return res.status(200).json(roadmaps);
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ error: err.message });
            }
            return res.status(400).json({ error: 'Unknown error' });
        }
    }
}