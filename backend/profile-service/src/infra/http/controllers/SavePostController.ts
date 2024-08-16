// src/infra/http/controllers/SavePostController.ts
import { Request, Response } from 'express';
import SavePost from '../../../app/useCases/Profile/SavePost';
import UserRepository from '../../../app/repositories/UserRepository';

export default class SavePostController {
    public async handle(req: Request, res: Response): Promise<Response> {
        const { postId } = req.body;
        const userId = (req as any).user.userId;

        const savePost = new SavePost(new UserRepository());

        try {
            const result = await savePost.execute(userId, postId);
            if (!result) {
                return res.status(404).json({ error: "User not found" });
            }
            return res.status(201).json(result);

        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ error: err.message });
            }
            return res.status(400).json({ error: "Unknown error" });
        }
    }
}
