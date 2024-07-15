import { Request, Response } from 'express';
import RemoveUserFromGroupChat from '../../../app/useCases/RemoveUserFromGroupChat';
import ChatRepository from '../../../app/repositories/ChatRepository';

export default class RemoveUserFromGroupChatController {
    public async handle(req: Request, res: Response): Promise<Response> {
        try {
            const { chatId } = req.params;
            const { userId } = req.body;
            const currentUserId = (req as any).user.userId;

            const removeUserFromGroupChat = new RemoveUserFromGroupChat(new ChatRepository());
            const chat = await removeUserFromGroupChat.execute(chatId, userId, currentUserId);

            return res.status(200).json(chat);
        } catch (err) {
            if (err instanceof Error) {
                console.error(`Error removing user from group chat: ${err.message}`);
                return res.status(400).json({ error: err.message });
            }
            return res.status(500).json({ error: "Unknown error" });
        }
    }
}