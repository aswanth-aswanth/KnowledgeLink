import { Request, Response } from 'express';
import GetSavedPosts from '../../../app/useCases/GetSavedPosts';
import PostRepository from '../../../app/repositories/PostRepository';

export default class GetSavedPostsController {
    public async handle(req: Request, res: Response) {
        try {
            const userId = (req as any).user.userId;
            const getSavedPosts = new GetSavedPosts(
                new PostRepository()
            );

            const result = await getSavedPosts.execute(userId);
            
            return res.status(200).json({ posts: result, message: "Success" });
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ error: err.message });
            }
            return res.status(500).json({ error: 'Unknown error' });
        }
    }
};
