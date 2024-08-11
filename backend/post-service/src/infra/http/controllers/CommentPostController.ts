import { Request, Response } from 'express';
import CommentPost from '../../../app/useCases/CommentPost';
import PostRepository from '../../../app/repositories/PostRepository';

export default class CommentPostController {
    public async handle(req: Request, res: Response) {
        try {
            const userId = (req as any).user.userId;
            // const postId = req.params.id;
            const { postId, text } = req.body;
            const commentPost = new CommentPost(
                new PostRepository()
            );
            const result = await commentPost.execute(postId, userId, text);
            return res.status(201).json({ message: "Success" });
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ error: err.message });
            }
            return res.status(500).json({ error: 'Unknown error' });
        }
    }
};
