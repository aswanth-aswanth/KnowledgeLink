import { Request, Response } from 'express';
import FollowUser from '../../../app/useCases/Profile/FollowUser';
import PostRepository from '../../../app/repositories/PostRepository';

export default class CreatePostController {
    public async handle(req: any, res: Response): Promise<Response> {
        const createPost = new CreatePost(
            new PostRepository()
        );
        const followerEmail = req.user.email;
        const followeeEmail = req.params.email;

        try {
            if (followerEmail === followeeEmail) {
                return res.status(400).json({ error: "You cannot follow yourself" });
            }

            const result = await followUser.execute(followerEmail, followeeEmail);
            return res.status(200).json(result);
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ error: err.message });
            }
            return res.status(400).json({ error: "Unknown error" });
        }
    }
}