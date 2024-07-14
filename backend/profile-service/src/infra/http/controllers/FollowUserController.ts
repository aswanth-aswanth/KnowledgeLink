import { Request, Response } from 'express';
import FollowUser from '../../../app/useCases/Profile/FollowUser';
import UserRepository from '../../../app/repositories/UserRepository';

export default class FollowUserController {

    public async handle(req: any, res: Response): Promise<Response> {
        const followUser = new FollowUser(new UserRepository());
        const followerUserId = req.user.userId;
        const followeeUserId = req.params.id;

        try {
            const result = await followUser.execute(followerUserId, followeeUserId);
            return res.status(200).json(result);
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ error: err.message });
            }
            return res.status(400).json({ error: "Unknown error" });
        }
    }
}
