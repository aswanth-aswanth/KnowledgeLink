import { Request, Response } from 'express';
import DeleteChat from '../../../app/useCases/DeleteChat';
import ChatRepository from '../../../app/repositories/ChatRepository';
import SocketService from '../../../infra/services/SocketService';

export default class DeleteChatController {
    public async handle(req: Request, res: Response): Promise<Response> {
        try {
            const { chatId } = req.params;
            const currentUserId = (req as any).user.userId;

            const chatRepository = new ChatRepository();
            const socketService = SocketService.getInstance();
            const deleteChat = new DeleteChat(chatRepository, socketService);
            await deleteChat.execute(chatId, currentUserId);

            return res.status(204).send();
        } catch (err) {
            if (err instanceof Error) {
                console.error(`Error deleting chat: ${err.message}`);
                return res.status(400).json({ error: err.message });
            }
            return res.status(500).json({ error: "Unknown error" });
        }
    }
}