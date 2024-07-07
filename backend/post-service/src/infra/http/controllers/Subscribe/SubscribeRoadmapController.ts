import { Request, Response } from 'express';
import SubscribeToRoadmap from '../../../../app/useCases/Profile/SubscribeToRoadmap';
import UserRepository from '../../../../app/repositories/UserRepository';

export default class SubscribeRoadmapController {
    public async handle(req: any, res: Response): Promise<Response> {
        const { roadmapId } = req.body;
        const email = req.user.email;
        console.log("RoadmapId : ", roadmapId);
        const subscribeToRoadmap = new SubscribeToRoadmap(
            new UserRepository()
        );

        try {

            const user = await subscribeToRoadmap.execute(email, roadmapId);
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
