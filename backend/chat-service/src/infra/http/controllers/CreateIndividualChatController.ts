import { Request, Response } from 'express';
import CreateIndividualChat from '../../../app/useCases/CreateIndividualChat';
import ChatRepository from '../../../app/repositories/ChatRepository';

export default class CreateIndividualChatController {
    public async handle(req: Request, res: Response): Promise<Response> {
        try {
            const { participantId } = req.body;
            const currentUserId = (req as any).user.userId;

            const createIndividualChat = new CreateIndividualChat(new ChatRepository());
            const chat = await createIndividualChat.execute(currentUserId, participantId);

            return res.status(201).json({
                id: chat.id,
                participants: chat.participants,
                type: chat.type,
                createdAt: chat.createdAt,
                updatedAt: chat.updatedAt
            });
        } catch (err) {
            if (err instanceof Error) {
                console.error(`Error creating individual chat: ${err.message}`);
                return res.status(400).json({ error: err.message });
            }
            return res.status(500).json({ error: "Unknown error" });
        }
    }
}