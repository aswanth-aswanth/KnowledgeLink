// src/infra/http/controllers/FAQ/AddFaqQuestionController.ts

import { Request, Response } from "express";
import AddFaqQuestion from "../../../../app/useCases/FAQ/AddFaqQuestion";
import FaqRepository from "../../../../app/repositories/FaqRepository";
import { Types } from "mongoose";

export default class AddFaqQuestionController {
    public async handle(req: Request, res: Response): Promise<Response> {
        const { roadmapId, topicId, topicUniqueId, question } = req.body;
        const authorId = (req as any).user.userId;

        const addFaqQuestion = new AddFaqQuestion(new FaqRepository());

        try {
            // Validate that roadmapId and topicId are valid ObjectId strings
            if (!Types.ObjectId.isValid(roadmapId) || !Types.ObjectId.isValid(topicId)) {
                return res.status(400).json({ error: "Invalid roadmapId or topicId" });
            }

            const faq = await addFaqQuestion.execute(roadmapId, topicId, topicUniqueId, question, authorId);
            return res.status(201).json(faq);
        } catch (error) {
            return res.status(400).json({ error: (error as Error).message });
        }
    }
}