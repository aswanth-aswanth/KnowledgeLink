import { Request, Response } from 'express';
import GetGroupMembers from '../../../app/useCases/GetGroupMembers';
import ChatRepository from '../../../app/repositories/ChatRepository';

export default class GetGroupMembersController {
    public async handle(req: Request, res: Response): Promise<Response> {
        try {
            const { chatId } = req.params;

            const getGroupMembers = new GetGroupMembers(new ChatRepository());
            const groupMembers = await getGroupMembers.execute(chatId);

            return res.status(200).json(groupMembers);
        } catch (err) {
            if (err instanceof Error) {
                console.error(`Error fetching group members: ${err.message}`);
                return res.status(400).json({ error: err.message });
            }
            return res.status(500).json({ error: "Unknown error" });
        }
    }
}
