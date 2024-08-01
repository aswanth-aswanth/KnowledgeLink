import { Request, Response } from 'express';
import GetAllGroupChats from '../../../app/useCases/GetAllGroupChats';
import ChatRepository from '../../../app/repositories/ChatRepository';

export default class GetAllGroupChatsController {
    public async handle(req: Request, res: Response): Promise<Response> {
        try {
            const getAllGroupChats = new GetAllGroupChats(new ChatRepository());
            const groupChats = await getAllGroupChats.execute();

            return res.status(200).json(groupChats);
        } catch (err) {
            if (err instanceof Error) {
                console.error(`Error fetching group chats: ${err.message}`);
                return res.status(400).json({ error: err.message });
            }
            return res.status(500).json({ error: "Unknown error" });
        }
    }
}
