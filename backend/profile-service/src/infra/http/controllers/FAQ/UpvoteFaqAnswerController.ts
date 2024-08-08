// src/infra/http/controllers/FAQ/UpvoteFaqAnswerController.ts

import { Request, Response } from "express";
import UpvoteFaqAnswer from "../../../../app/useCases/FAQ/UpvoteFaqAnswer";
import FaqRepository from "../../../../app/repositories/FaqRepository";

export default class UpvoteFaqAnswerController {
    public async handle(req: Request, res: Response): Promise<Response> {
        const { faqId, answerId } = req.params;
        const userId = (req as any).user.userId;

        const upvoteFaqAnswer = new UpvoteFaqAnswer(new FaqRepository());

        try {
            const updatedFaq = await upvoteFaqAnswer.execute(faqId, answerId, userId);
            return res.status(200).json(updatedFaq);
        } catch (error) {
            return res.status(400).json({ error: (error as Error).message });
        }
    }
}