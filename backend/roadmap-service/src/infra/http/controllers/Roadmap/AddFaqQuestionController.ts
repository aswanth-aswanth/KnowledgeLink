import { Request, Response } from "express";
import AddFaqQuestion from "../../../../app/useCases/Roadmap/AddFaqQuestion";
import FaqRepository from "../../../../app/repositories/FaqRepository";
import { AddFaqQuestionDTO } from "@/infra/databases/interfaces/IFaq";
import mongoose from "mongoose";

export default class AddFaqQuestionController {
    public async handle(req: Request, res: Response): Promise<Response> {
        const { roadmapId, topicId, topicUniqueId, question }: AddFaqQuestionDTO = req.body;
        const contributorId = (req as any).user.userId;
        const faqRepository = new FaqRepository();
        const addFaqQuestion = new AddFaqQuestion(faqRepository);

        try {
            if (!mongoose.Types.ObjectId.isValid(roadmapId) || !mongoose.Types.ObjectId.isValid(topicId)) {
                return res.status(400).json({ message: "Invalid roadmapId or topicId" });
            }

            const newFaq = await addFaqQuestion.execute({
                roadmapId: new mongoose.Types.ObjectId(roadmapId),
                topicId: new mongoose.Types.ObjectId(topicId),
                topicUniqueId,
                question,
                contributorId
            });

            return res.status(201).json(newFaq);
        } catch (error) {
            console.error("Faq controller: Error occurred", error);
            return res.status(500).json({ message: (error as Error).message });
        }
    }
}
