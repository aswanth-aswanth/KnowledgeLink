import { Request, Response } from 'express';
import UnlikeShort from '../../../app/useCases/UnlikeShort';
import ShortRepository from '../../../app/repositories/ShortRepository';
import UserRepository from '../../../app/repositories/UserRepository';

export default class UnlikeShortController {
    public async handle(req: Request, res: Response): Promise<Response> {
        try {
            const { shortId } = req.params;
            const userId = (req as any).user.userId;

            const unlikeShort = new UnlikeShort(
                new ShortRepository(),
                new UserRepository()
            );

            await unlikeShort.execute(shortId, userId);

            return res.status(200).json({ message: 'Short unliked successfully' });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ error: error.message });
            }
            return res.status(400).json({ error: "Unknown error" });
        }
    }
}