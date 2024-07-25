import { Request, Response } from "express";
import GetPersonalizedTopics from "../../../app/useCases/UserInteraction/GetPersonalizedTopics";
import RoadmapRepository from "../../../app/repositories/RoadmapRepository";
import UserInteractionRepository from "../../../app/repositories/UserInteractionRepository";

export default class GetPersonalizedTopicsController {
  public async handle(req: Request, res: Response) {
    const userId = (req as any).user?.userId;
    const count = parseInt(req.query.count as string) || 5;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const getPersonalizedTopics = new GetPersonalizedTopics(
      new RoadmapRepository(),
      new UserInteractionRepository()
    );

    try {
      const topics = await getPersonalizedTopics.execute(userId, count);
      return res.status(200).json(topics);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
      }
      return res.status(400).json({ error: 'Unknown error' });
    }
  }
}