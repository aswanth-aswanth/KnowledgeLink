import { Request, Response } from 'express';
import GetUserGroupChats from '../../../app/useCases/GetUserGroupChats';
import ChatRepository from '../../../app/repositories/ChatRepository';

export default class GetUserGroupChatsController {
    public async handle(req: Request, res: Response): Promise<Response> {
        try {
            const currentUserId = (req as any).user.userId;
            const chatRepository = new ChatRepository();
            const getUserGroupChats = new GetUserGroupChats(chatRepository);
            const groupChats = await getUserGroupChats.execute(currentUserId);
            return res.status(200).json(groupChats);
        } catch (err) {
            if (err instanceof Error) {
                console.error(`Error getting user group chats: ${err.message}`);
                return res.status(400).json({ error: err.message });
            }
            return res.status(500).json({ error: "Unknown error" });
        }
    }
}