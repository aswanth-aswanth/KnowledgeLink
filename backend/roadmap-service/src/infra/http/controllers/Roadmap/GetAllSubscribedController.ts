import { Request, Response } from "express";
import GetAllSubscribedRoadmaps from "../../../../app/useCases/Roadmap/GetAllSubscribedRoadmaps";
import RoadmapRepository from "../../../../app/repositories/RoadmapRepository";

export default class GetAllSubscribedController {
    public async handle(req: any, res: Response) {

        const email = req.user.email;

        const getAllSubscribedRoadmaps = new GetAllSubscribedRoadmaps(
            new RoadmapRepository()
        );

        try {
            const roadmaps = await getAllSubscribedRoadmaps.execute(email);
            return res.status(200).json(roadmaps);
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ error: err.message });
            }
            return res.status(400).json({ error: 'Unknown error' });
        }
    }
}