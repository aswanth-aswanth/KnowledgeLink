import { Request, Response } from 'express';
import GetUsers from '../../../app/useCases/Profile/GetUsers';
import UserRepository from '../../../app/repositories/UserRepository';

export default class GetUsersController {
    public async handle(req: any, res: Response): Promise<Response> {
        const getUsers = new GetUsers(
            new UserRepository()
        );

        try {
            const currentUserId = req.user?.userId; 
            const users = await getUsers.execute(currentUserId); 
            
            if (!users) {
                return res.status(404).json({ error: "Users not found" });
            }
            return res.status(200).json(users);

        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ error: err.message });
            }
            return res.status(400).json({ error: "Unknown error" });
        }
    }
}
