import { Request, Response } from 'express';
import GetPaginatedUsers from '../../../app/useCases/Profile/GetPaginatedUsers';
import UserRepository from '../../../app/repositories/UserRepository';

export default class GetPaginatedUsersController {
    public async handle(req: Request, res: Response): Promise<Response> {
        const getPaginatedUsers = new GetPaginatedUsers(
            new UserRepository()
        );

        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const result = await getPaginatedUsers.execute(page, limit);
            return res.status(200).json(result);

        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ error: err.message });
            }
            return res.status(400).json({ error: "Unknown error" });
        }
    }
}