import { Request, Response } from 'express';
import DeleteReply from '../../../app/useCases/DeleteReply';
import PostRepository from '../../../app/repositories/PostRepository';

export default class DeleteReplyController {
    public async handle(req: any, res: Response) {
        try {
            const email = req.user.email;
            const { replyId, commentId } = req.body;
            const deleteReply = new DeleteReply(
                new PostRepository()
            );
            const result = await deleteReply.execute(commentId, replyId, email);
            return res.status(201).json({ message: "Success" });
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ error: err.message });
            }
            return res.status(500).json({ error: 'Unknown error' });
        }
    }
};
