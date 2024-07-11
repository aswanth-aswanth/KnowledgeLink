import { Request, Response } from 'express';
import GetUserPosts from '../../../app/useCases/GetUserPosts';
import PostRepository from '../../../app/repositories/PostRepository';

export default class GetUserPostsController {
    public async handle(req: any, res: Response): Promise<Response> {
        try {
            const { email } = req.params;
            const { page = 1, limit = 10 } = req.query;
            const currentUserEmail = req?.user?.email;
            const getUserPosts = new GetUserPosts(new PostRepository());
            const posts = await getUserPosts.execute(email, currentUserEmail, Number(page), Number(limit));
            return res.status(200).json(posts);
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ error: err.message });
            }
            return res.status(500).json({ error: 'Unknown error' });
        }
    }
}
