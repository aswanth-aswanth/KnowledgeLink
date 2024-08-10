import { Request, Response } from "express";
import GetRoadmapsByMember from "../../../../app/useCases/Roadmap/GetRoadmapsByMember";
import RoadmapRepository from "../../../../app/repositories/RoadmapRepository";

export default class GetRoadmapsByMemberController {
    public async handle(req: Request, res: Response) {

        const userId = (req as any).user.userId;
        console.log("userId from request : ", userId);
        const getRoadmapsByMember = new GetRoadmapsByMember(
            new RoadmapRepository(),
        );

        try {
            const roadmaps = await getRoadmapsByMember.execute(userId);
            return res.status(200).json(roadmaps);
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ error: err.message });
            }
            return res.status(400).json({ error: 'Unknown error' });
        }
    }
}