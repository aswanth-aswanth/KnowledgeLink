import { Request, Response } from 'express';
import LikeShort from '../../../app/useCases/LikeShort';
import ShortRepository from '../../../app/repositories/ShortRepository';
import UserRepository from '../../../app/repositories/UserRepository';

export default class LikeShortController {
    public async handle(req: Request, res: Response): Promise<Response> {
        try {
            const { shortId } = req.params;
            const userId = (req as any).user._id;

            const likeShort = new LikeShort(
                new ShortRepository(),
                new UserRepository()
            );

            await likeShort.execute(shortId, userId);

            return res.status(200).json({ message: 'Short liked successfully' });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ error: error.message });
            }
            return res.status(400).json({ error: "Unknown error" });
        }
    }
}