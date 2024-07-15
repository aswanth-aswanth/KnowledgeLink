import { Request, Response } from 'express';
import SendMessage from '../../../app/useCases/SendMessage';
import ChatRepository from '../../../app/repositories/ChatRepository';

export default class SendMessageController {
    public async handle(req: Request, res: Response): Promise<Response> {
        try {
            const { chatId, content } = req.body;
            const senderId = (req as any).user.id;

            const sendMessage = new SendMessage(new ChatRepository());
            const message = await sendMessage.execute(chatId, senderId, content);

            return res.status(201).json({
                id: message.id,
                chatId: message.chatId,
                senderId: message.senderId,
                content: message.content,
                createdAt: message.createdAt
            });
        } catch (err) {
            if (err instanceof Error) {
                console.error(`Error sending message: ${err.message}`);
                return res.status(400).json({ error: err.message });
            }
            return res.status(500).json({ error: "Unknown error" });
        }
    }
}