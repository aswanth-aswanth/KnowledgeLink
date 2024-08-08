// src/app/useCases/FAQ/GetFaqsByRoadmapAndTopic.ts

import FaqRepository from "../../repositories/FaqRepository";
import { IFaq } from "../../../infra/databases/interfaces/IFaq";

export default class GetFaqsByRoadmapAndTopic {
    private faqRepository: FaqRepository;

    constructor(faqRepository: FaqRepository) {
        this.faqRepository = faqRepository;
    }

    public async execute(roadmapId: string, topicUniqueId: string): Promise<IFaq[]> {
        return await this.faqRepository.findByRoadmapAndTopic(roadmapId, topicUniqueId);
    }
}