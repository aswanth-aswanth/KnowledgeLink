import { Request, Response } from 'express';
import GetChatMessages from '../../../app/useCases/GetChatMessages';
import ChatRepository from '../../../app/repositories/ChatRepository';

export default class GetChatMessagesController {
    public async handle(req: Request, res: Response): Promise<Response> {
        try {
            const { chatId } = req.params;
            const currentUserId = (req as any).user.userId;

            const getChatMessages = new GetChatMessages(new ChatRepository());
            const messages = await getChatMessages.execute(chatId, currentUserId);

            return res.status(200).json(messages);
        } catch (err) {
            if (err instanceof Error) {
                console.error(`Error getting chat messages: ${err.message}`);
                return res.status(400).json({ error: err.message });
            }
            return res.status(500).json({ error: "Unknown error" });
        }
    }
}