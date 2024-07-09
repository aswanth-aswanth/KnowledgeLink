import { Request, Response } from "express";
import GetRoadmapsByMember from "../../../../app/useCases/Roadmap/GetRoadmapsByMember";
import RoadmapRepository from "../../../../app/repositories/RoadmapRepository";

export default class GetRoadmapsByMemberController {
    public async handle(req: any, res: Response) {

        const email = req.user.email;
        const getRoadmapsByMember = new GetRoadmapsByMember(
            new RoadmapRepository(),
        );

        try {
            const roadmaps = await getRoadmapsByMember.execute(email);
            return res.status(200).json(roadmaps);
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ error: err.message });
            }
            return res.status(400).json({ error: 'Unknown error' });
        }
    }
}