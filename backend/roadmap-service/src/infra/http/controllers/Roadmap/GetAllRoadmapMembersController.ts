import { Request, Response } from "express";
import GetAllRoadmapMembers from "../../../../app/useCases/Roadmap/GetAllRoadmapMembers";
import RoadmapRepository from "../../../../app/repositories/RoadmapRepository";

export default class GetAllRoadmapMembersController {
    public async handle(req: Request, res: Response) {

        const roadmapId = req.params.id;
        console.log("roadmapId : ", roadmapId);
        const getAllRoadmapMembers = new GetAllRoadmapMembers(
            new RoadmapRepository(),
        );

        try {
            const roadmaps = await getAllRoadmapMembers.execute(roadmapId);
            return res.status(200).json(roadmaps);
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ error: err.message });
            }
            return res.status(400).json({ error: 'Unknown error' });
        }
    }
}