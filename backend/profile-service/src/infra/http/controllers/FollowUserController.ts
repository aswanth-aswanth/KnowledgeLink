import { Request, Response } from 'express';
import FollowUser from '../../../app/useCases/Profile/FollowUser';
import UserRepository from '../../../app/repositories/UserRepository';

export default class FollowUserController {
    public async handle(req: any, res: Response): Promise<Response> {
        const followUser = new FollowUser(
            new UserRepository()
        );
        const followerEmail = req.user.email;
        const followeeEmail = req.params.email;

        try {

            const user = await followUser.execute(followerEmail, followeeEmail);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            return res.status(200).json(user);

        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ error: err.message });
            }
            return res.status(400).json({ error: "Unknown error" });
        }
    }
}
