import { Request, Response } from "express";
import GetRoadmapsByAdmin from "../../../../app/useCases/Roadmap/GetRoadmapsByAdmin";
import RoadmapRepository from "../../../../app/repositories/RoadmapRepository";

export default class GetRoadmapsByAdminController {
    public async handle(req: any, res: Response) {

        const email = req.user.email;

        const getRoadmapsByAdmin = new GetRoadmapsByAdmin(
            new RoadmapRepository()
        );

        try {
            const roadmaps = await getRoadmapsByAdmin.execute(email);
            return res.status(200).json(roadmaps);
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ error: err.message });
            }
            return res.status(400).json({ error: 'Unknown error' });
        }
    }
}