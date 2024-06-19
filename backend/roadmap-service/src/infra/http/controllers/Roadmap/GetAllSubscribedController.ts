import { Request, Response } from "express";
import GetAllSubscribedRoadmaps from "../../../../app/useCases/Roadmap/GetAllSubscribedRoadmaps";
import RoadmapRepository from "../../../../app/repositories/RoadmapRepository";

export default class GetAllSubscribedController {
    public async handle(req: Request, res: Response) {

        const userId = "6672dbe2c4ea1ad6d118db86";

        const getAllSubscribedRoadmaps = new GetAllSubscribedRoadmaps(
            new RoadmapRepository()
        );

        try {
            const roadmaps = await getAllSubscribedRoadmaps.execute(userId);
            return res.status(200).json(roadmaps);
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ error: err.message });
            }
            return res.status(400).json({ error: 'Unknown error' });
        }
    }
}