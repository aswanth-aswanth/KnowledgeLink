import { Request, Response } from 'express';
import ReplyComment from '../../../app/useCases/ReplyComment';
import PostRepository from '../../../app/repositories/PostRepository';

export default class ReplyCommentController {
    public async handle(req: any, res: Response) {
        try {
            const email = req.user.email;
            const { text, commentId } = req.body;
            const replyComment = new ReplyComment(
                new PostRepository()
            );
            const result = await replyComment.execute(commentId, email, text);
            return res.status(201).json({ message: "Success" });
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ error: err.message });
            }
            return res.status(500).json({ error: 'Unknown error' });
        }
    }
};
