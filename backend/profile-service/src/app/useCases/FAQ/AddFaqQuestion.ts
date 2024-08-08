// src/app/useCases/FAQ/AddFaqQuestion.ts

import FaqRepository from "../../repositories/FaqRepository";
import { IFaq } from "../../../infra/databases/interfaces/IFaq";
import { Types } from "mongoose";

export default class AddFaqQuestion {
    private faqRepository: FaqRepository;

    constructor(faqRepository: FaqRepository) {
        this.faqRepository = faqRepository;
    }

    public async execute(
        roadmapId: string,
        topicId: string,
        topicUniqueId: string,
        question: string,
        authorId: string
    ): Promise<IFaq> {
        const faqData: Partial<IFaq> = {
            roadmapId: new Types.ObjectId(roadmapId),
            topicId: new Types.ObjectId(topicId),
            topicUniqueId,
            question,
            authorId
        };

        return await this.faqRepository.create(faqData);
    }
}