import { Request, Response } from 'express';
import CreateIndividualChat from '../../../app/useCases/CreateIndividualChat';
import ChatRepository from '../../../app/repositories/ChatRepository';
import SocketService from '../../../infra/services/SocketService';

export default class CreateIndividualChatController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { participantId } = req.body;
    const currentUserId = (req as any).user.userId;

    const chatRepository = new ChatRepository();
    const socketService = SocketService.getInstance();
    const createIndividualChat = new CreateIndividualChat(chatRepository, socketService);

    try {
      const chat = await createIndividualChat.execute(currentUserId, participantId);
      return res.status(201).json(chat);
    } catch (err) {
      if (err instanceof Error) {
        console.error(`Error creating individual chat: ${err.message}`);
        return res.status(400).json({ error: err.message });
      }
      return res.status(500).json({ error: "Unknown error" });
    }
  }
}