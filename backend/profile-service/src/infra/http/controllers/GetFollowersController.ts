import { Request, Response } from 'express';
import GetFollowers from '../../../app/useCases/Profile/GetFollowers';
import UserRepository from '../../../app/repositories/UserRepository';

export default class GetFollowersController {
    public async handle(req: Request, res: Response): Promise<Response> {
        const userId = req.params.id;

        const getFollowers = new GetFollowers(new UserRepository());

        try {
            const followers = await getFollowers.execute(userId);
            if (!followers || followers.length === 0) {
                return res.status(404).json({ message: "No followers found" });
            }
            return res.status(200).json(followers);

        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ error: err.message });
            }
            return res.status(400).json({ error: "Unknown error" });
        }
    }
}
