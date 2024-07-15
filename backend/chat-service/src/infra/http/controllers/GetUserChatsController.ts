import { Request, Response } from 'express';
import GetUserChats from '../../../app/useCases/GetUserChats.ts';
import ChatRepository from '../../../app/repositories/ChatRepository';

export default class GetUserChatsController {
    public async handle(req: Request, res: Response): Promise<Response> {
        try {
            const currentUserId = (req as any).user.userId;

            const getUserChats = new GetUserChats(new ChatRepository());
            const chats = await getUserChats.execute(currentUserId);

            return res.status(200).json(chats.map(chat => ({
                id: chat.id,
                participants: chat.participants,
                type: chat.type,
                lastMessage: chat.messages[chat.messages.length - 1],
                createdAt: chat.createdAt,
                updatedAt: chat.updatedAt
            })));
        } catch (err) {
            if (err instanceof Error) {
                console.error(`Error getting user chats: ${err.message}`);
                return res.status(400).json({ error: err.message });
            }
            return res.status(500).json({ error: "Unknown error" });
        }
    }
}