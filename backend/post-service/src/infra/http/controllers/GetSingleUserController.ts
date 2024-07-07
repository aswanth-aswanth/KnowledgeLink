import { Request, Response } from 'express';
import GetSingleUser from '../../../app/useCases/Profile/GetSingleUser';
import UserRepository from '../../../app/repositories/UserRepository';

export default class GetSingleUserController {
    public async handle(req: any, res: Response): Promise<Response> {
        const getSingleUser = new GetSingleUser(
            new UserRepository()
        );

        try {
            const loggedInUserEmail = req.user ? req.user.email : null;
            const user = await getSingleUser.execute(req.params.id, loggedInUserEmail);
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