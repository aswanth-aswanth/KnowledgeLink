import { Request, Response } from 'express';
import GetChatById from '../../../app/useCases/GetChatById';
import ChatRepository from '../../../app/repositories/ChatRepository';

export default class GetChatByIdController {
    public async handle(req: Request, res: Response): Promise<Response> {
        try {
            const { chatId } = req.params;
            const currentUserId = (req as any).user.userId;

            const getChatById = new GetChatById(new ChatRepository());
            const chat = await getChatById.execute(chatId, currentUserId);

            return res.status(200).json({
                id: chat.id,
                participants: chat.participants,
                type: chat.type,
                messages: chat.messages,
                createdAt: chat.createdAt,
                updatedAt: chat.updatedAt
            });
        } catch (err) {
            if (err instanceof Error) {
                console.error(`Error getting chat by ID: ${err.message}`);
                return res.status(400).json({ error: err.message });
            }
            return res.status(500).json({ error: "Unknown error" });
        }
    }
}