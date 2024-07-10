import { Request, Response } from 'express';
import GetReplies from '../../../app/useCases/GetReplies';
import PostRepository from '../../../app/repositories/PostRepository';

export default class GetRepliesController {
    public async handle(req: Request, res: Response): Promise<Response> {
        try {
            const { commentId } = req.params;
            const { page = 1, limit = 10 } = req.query;
            const getReplies = new GetReplies(new PostRepository());
            const replies = await getReplies.execute(commentId, Number(page), Number(limit));
            return res.status(200).json(replies);
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ error: err.message });
            }
            return res.status(500).json({ error: 'Unknown error' });
        }
    }
}
