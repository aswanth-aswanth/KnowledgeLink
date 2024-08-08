// src/infra/http/controllers/FAQ/AddFaqAnswerController.ts

import { Request, Response } from "express";
import AddFaqAnswer from "../../../../app/useCases/FAQ/AddFaqAnswer";
import FaqRepository from "../../../../app/repositories/FaqRepository";

export default class AddFaqAnswerController {
    public async handle(req: Request, res: Response): Promise<Response> {
        const { faqId, content } = req.body;
        const authorId = (req as any).user.userId;

        const addFaqAnswer = new AddFaqAnswer(new FaqRepository());

        try {
            const updatedFaq = await addFaqAnswer.execute(faqId, content, authorId);
            return res.status(200).json(updatedFaq);
        } catch (error) {
            return res.status(400).json({ error: (error as Error).message });
        }
    }
}