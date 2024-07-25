import { Request, Response } from "express";
import GetRandomTopics from "../../../app/useCases/Roadmap/GetRandomTopics";
import RoadmapRepository from "../../../app/repositories/RoadmapRepository";

export default class GetRandomTopicsController {
    public async handle(req: Request, res: Response) {
        const count = parseInt(req.query.count as string) || 5;

        const getRandomTopics = new GetRandomTopics(
            new RoadmapRepository()
        );

        try {
            const topics = await getRandomTopics.execute(count);
            return res.status(200).json(topics);
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ error: err.message });
            }
            return res.status(400).json({ error: 'Unknown error' });
        }
    }
}
