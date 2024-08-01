import { Request, Response } from 'express';
import GetFollowings from '../../../app/useCases/Profile/GetFollowings';
import UserRepository from '../../../app/repositories/UserRepository';

export default class GetFollowingsController {
    public async handle(req: Request, res: Response): Promise<Response> {
        const userId = req.params.id;

        const getFollowings = new GetFollowings(new UserRepository());

        try {
            const followings = await getFollowings.execute(userId);
            if (!followings || followings.length === 0) {
                return res.status(404).json({ message: "No followings found" });
            }
            return res.status(200).json(followings);

        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ error: err.message });
            }
            return res.status(400).json({ error: "Unknown error" });
        }
    }
}
