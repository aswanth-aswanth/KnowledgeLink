import { Request, Response } from 'express';
import UpdateChat from '../../../app/useCases/UpdateChat';
import ChatRepository from '../../../app/repositories/ChatRepository';
import SocketService from '../../../infra/services/SocketService';

export default class UpdateChatController {
    public async handle(req: Request, res: Response): Promise<Response> {
        try {
            const { chatId } = req.params;
            const { name } = req.body;
            const currentUserId = (req as any).user.userId;

            const chatRepository = new ChatRepository();
            const socketService = SocketService.getInstance();
            const updateChat = new UpdateChat(chatRepository, socketService);
            const chat = await updateChat.execute(chatId, { name }, currentUserId);

            return res.status(200).json(chat);
        } catch (err) {
            if (err instanceof Error) {
                console.error(`Error updating chat: ${err.message}`);
                return res.status(400).json({ error: err.message });
            }
            return res.status(500).json({ error: "Unknown error" });
        }
    }
}