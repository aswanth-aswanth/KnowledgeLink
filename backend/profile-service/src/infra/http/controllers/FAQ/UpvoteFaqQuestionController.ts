// src/infra/http/controllers/FAQ/UpvoteFaqQuestionController.ts

import { Request, Response } from "express";
import UpvoteFaqQuestion from "../../../../app/useCases/FAQ/UpvoteFaqQuestion";
import FaqRepository from "../../../../app/repositories/FaqRepository";

export default class UpvoteFaqQuestionController {
    public async handle(req: Request, res: Response): Promise<Response> {
        const { faqId } = req.params;
        const userId = (req as any).user.userId;

        const upvoteFaqQuestion = new UpvoteFaqQuestion(new FaqRepository());

        try {
            const updatedFaq = await upvoteFaqQuestion.execute(faqId, userId);
            return res.status(200).json(updatedFaq);
        } catch (error) {
            return res.status(400).json({ error: (error as Error).message });
        }
    }
}