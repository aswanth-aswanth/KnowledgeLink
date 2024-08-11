import { Request, Response } from 'express';
import UnSubscribeToRoadmap from '../../../../app/useCases/Profile/UnSubscribeToRoadmap';
import UserRepository from '../../../../app/repositories/UserRepository';

export default class UnSubscribeRoadmapController {
    public async handle(req: any, res: Response): Promise<Response> {
        const { roadmapId } = req.body;
        const userId = req.user.userId;
        const unSubscribeToRoadmap = new UnSubscribeToRoadmap(
            new UserRepository()
        );

        try {

            const user = await unSubscribeToRoadmap.execute(userId, roadmapId);
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
