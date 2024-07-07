import { Request, Response } from 'express';
import LikePost from '../../../app/useCases/LikePost';
import PostRepository from '../../../app/repositories/PostRepository';

export default class LikePostController {
    public async handle(req: any, res: Response) {
        try {
            const email = req.user.email;
            const postId = req.params.id;
            const likePost = new LikePost(
                new PostRepository()
            );
            const result = await likePost.execute(postId, email);
            return res.status(201).json({ message: "Success" });
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ error: err.message });
            }
            return res.status(500).json({ error: 'Unknown error' });
        }
    }
};
