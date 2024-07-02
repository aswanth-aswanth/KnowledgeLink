import { Request, Response } from 'express';
import GetSearchUsers from '../../../app/useCases/Profile/GetSearchUsers';
import UserRepository from '../../../app/repositories/UserRepository';

export default class GetSearchUsersController {
    public async handle(req: any, res: Response): Promise<Response> {
        const getSearchUsers = new GetSearchUsers(
            new UserRepository()
        );

        try {
            const user = await getSearchUsers.execute(req.query.name, req.query.limit);
            if (!user) {
                return res.status(404).json({ error: "Users not found" });
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