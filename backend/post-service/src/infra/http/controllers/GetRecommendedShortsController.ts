import { Request, Response } from 'express';
import GetRecommendedShorts from '../../../app/useCases/GetRecommendedShorts';
import ShortRepository from '../../../app/repositories/ShortRepository';
import UserRepository from '../../../app/repositories/UserRepository';

export default class GetRecommendedShortsController {
    public async handle(req: Request, res: Response): Promise<Response> {
        try {
            const userId = (req as any).user?.userId || null;
            const limit = parseInt(req.query.limit as string) || 10;

            const getRecommendedShorts = new GetRecommendedShorts(
                new ShortRepository(),
                new UserRepository()
            );

            const recommendedShorts = await getRecommendedShorts.execute(userId, limit);

            return res.status(200).json(recommendedShorts);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ error: error.message });
            }
            return res.status(400).json({ error: "Unknown error" });
        }
    }
}