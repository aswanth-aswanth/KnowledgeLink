// src/infra/http/controllers/CreateGroupChatController.ts

import { Request, Response } from 'express';
import CreateGroupChat from '../../../app/useCases/CreateGroupChat';
import ChatRepository from '../../../app/repositories/ChatRepository';

export default class CreateGroupChatController {
    public async handle(req: Request, res: Response): Promise<Response> {
        try {
            const { name, participantIds } = req.body;
            const currentUserId = (req as any).user.userId;

            const createGroupChat = new CreateGroupChat(new ChatRepository());
            const chat = await createGroupChat.execute(name, [currentUserId, ...participantIds]);

            return res.status(201).json({
                id: chat.id,
                name: chat.name,
                participants: chat.participants,
                type: chat.type,
                createdAt: chat.createdAt,
                updatedAt: chat.updatedAt
            });
        } catch (err) {
            if (err instanceof Error) {
                console.error(`Error creating group chat: ${err.message}`);
                return res.status(400).json({ error: err.message });
            }
            return res.status(500).json({ error: "Unknown error" });
        }
    }
}