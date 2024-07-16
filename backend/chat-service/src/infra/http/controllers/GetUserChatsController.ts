import { Request, Response } from 'express';
import ChatRepository from '../../../app/repositories/ChatRepository';
import GetUserChats from '../../../app/useCases/GetUserChats';
type UserChatInfo = {
    userId: string;
    chatId: string;
    lastMessage: string;
    updatedAt: Date;
};
export default class GetUserChatsController {
    public async handle(req: Request, res: Response): Promise<Response> {
        try {
            const currentUserId = (req as any).user.userId;

            const getUserChats = new GetUserChats(new ChatRepository());
            const userChats: UserChatInfo[] = await getUserChats.execute(currentUserId);

            return res.status(200).json(userChats);
        } catch (err) {
            if (err instanceof Error) {
                console.error(`Error fetching user chats: ${err.message}`);
                return res.status(400).json({ error: err.message });
            }
            return res.status(500).json({ error: "Unknown error" });
        }
    }
}
