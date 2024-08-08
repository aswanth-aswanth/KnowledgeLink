// src/infra/http/controllers/FAQ/GetFaqsByRoadmapAndTopicController.ts

import { Request, Response } from "express";
import GetFaqsByRoadmapAndTopic from "../../../../app/useCases/FAQ/GetFaqsByRoadmapAndTopic";
import FaqRepository from "../../../../app/repositories/FaqRepository";

export default class GetFaqsByRoadmapAndTopicController {
    public async handle(req: Request, res: Response): Promise<Response> {
        const { roadmapId, topicUniqueId } = req.params;

        const getFaqsByRoadmapAndTopic = new GetFaqsByRoadmapAndTopic(new FaqRepository());

        try {
            const faqs = await getFaqsByRoadmapAndTopic.execute(roadmapId, topicUniqueId);
            return res.status(200).json(faqs);
        } catch (error) {
            return res.status(400).json({ error: (error as Error).message });
        }
    }
}