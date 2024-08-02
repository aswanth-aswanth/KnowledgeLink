import { Request, Response } from 'express';
import GetUserPosts from '../../../app/useCases/GetUserPost';
import PostRepository from '../../../app/repositories/PostRepository';

export default class GetUserPostsController {
    public async handle(req: any, res: Response): Promise<Response> {
        try {
            const { postId } = req.params;
            const currentUserEmail = req?.user?.email;
            const getUserPost = new GetUserPosts(new PostRepository());
            const posts = await getUserPost.execute(postId, currentUserEmail);
            return res.status(200).json(posts);
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ error: err.message });
            }
            return res.status(500).json({ error: 'Unknown error' });
        }
    }
}
