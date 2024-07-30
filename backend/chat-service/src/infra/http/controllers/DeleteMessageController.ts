// Create a new file: DeleteMessageController.ts

import { Request, Response } from 'express';
import DeleteMessage from '../../../app/useCases/DeleteMessage';
import ChatRepository from '../../../app/repositories/ChatRepository';

export default class DeleteMessageController {
    public async handle(req: Request, res: Response): Promise<Response> {
        try {
            const { chatId, messageId } = req.params;
            const userId = (req as any).user.userId;

            const deleteMessage = new DeleteMessage(new ChatRepository());
            await deleteMessage.execute(chatId, messageId, userId);

            return res.status(200).json({ message: 'Message deleted successfully' });
        } catch (err) {
            if (err instanceof Error) {
                console.error(`Error deleting message: ${err.message}`);
                return res.status(400).json({ error: err.message });
            }
            return res.status(500).json({ error: "Unknown error" });
        }
    }
}