import { Request, Response } from "express";
import LogUserInteraction from "../../../app/useCases/UserInteraction/LogUserInteraction";
import UserInteractionRepository from "../../../app/repositories/UserInteractionRepository";

export default class LogUserInteractionController {
    public async handle(req: Request, res: Response) {
        const userId = (req as any).user?.userId;
        const { roadmapId, topicId, interactionType } = req.body;

        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const logUserInteraction = new LogUserInteraction(
            new UserInteractionRepository()
        );

        try {
            await logUserInteraction.execute(userId, roadmapId, topicId, interactionType);
            return res.status(200).json({ message: 'User interaction logged successfully' });
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ error: err.message });
            }
            return res.status(400).json({ error: 'Unknown error' });
        }
    }
}