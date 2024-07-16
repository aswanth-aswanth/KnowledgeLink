// src/infra/http/controllers/AddUserToGroupChatController.ts

import { Request, Response } from 'express';
import AddUserToGroupChat from '../../../app/useCases/AddUserToGroupChat';
import ChatRepository from '../../../app/repositories/ChatRepository';

export default class AddUserToGroupChatController {
    public async handle(req: Request, res: Response): Promise<Response> {
        try {
            const { chatId } = req.params;
            const { userId } = req.body;
            const currentUserId = (req as any).user.userId;

            const addUserToGroupChat = new AddUserToGroupChat(new ChatRepository());
            const chat = await addUserToGroupChat.execute(chatId, userId, currentUserId);

            return res.status(200).json(chat);
        } catch (err) {
            if (err instanceof Error) {
                console.error(`Error adding user to group chat: ${err.message}`);
                return res.status(400).json({ error: err.message });
            }
            return res.status(500).json({ error: "Unknown error" });
        }
    }
}