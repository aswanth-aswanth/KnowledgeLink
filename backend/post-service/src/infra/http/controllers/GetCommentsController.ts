import { Request, Response } from 'express';
import GetComments from '../../../app/useCases/GetComments';
import PostRepository from '../../../app/repositories/PostRepository';

export default class GetCommentsController {
    public async handle(req: Request, res: Response): Promise<Response> {
        try {
            const { postId } = req.params;
            const { page = 1, limit = 10 } = req.query;
            const getComments = new GetComments(new PostRepository());
            const comments = await getComments.execute(postId, Number(page), Number(limit));
            return res.status(200).json(comments);
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ error: err.message });
            }
            return res.status(500).json({ error: 'Unknown error' });
        }
    }
}
