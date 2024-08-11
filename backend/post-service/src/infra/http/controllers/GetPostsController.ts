import { Request, Response } from 'express';
import GetPosts from '../../../app/useCases/GetPosts';
import PostRepository from '../../../app/repositories/PostRepository';

export default class GetPostsController {
    public async handle(req: Request, res: Response) {
        try {
            const userId = (req as any).user.userId;
            const getPosts = new GetPosts(
                new PostRepository()
            );
            const result = await getPosts.execute(userId);
            return res.status(201).json({ posts: result, message: "Success" });
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ error: err.message });
            }
            return res.status(500).json({ error: 'Unknown error' });
        }
    }
};
