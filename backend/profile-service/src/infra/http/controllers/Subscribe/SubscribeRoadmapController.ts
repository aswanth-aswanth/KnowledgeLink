import { Request, Response } from 'express';
import SubscribeToRoadmap from '../../../../app/useCases/Profile/SubscribeToRoadmap';
import UserRepository from '../../../../app/repositories/UserRepository';

export default class SubscribeRoadmapController {
    public async handle(req: Request, res: Response): Promise<Response> {
        const { roadmapId } = req.body;
        const userId = "6672dbe2c4ea1ad6d118db86";
        const subscribeToRoadmap = new SubscribeToRoadmap(
            new UserRepository()
        );

        try {

            const user = await subscribeToRoadmap.execute(userId, roadmapId);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            return res.status(201).json(user);

        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ error: err.message });
            }
            return res.status(400).json({ error: "Unknown error" });
        }
    }
}
