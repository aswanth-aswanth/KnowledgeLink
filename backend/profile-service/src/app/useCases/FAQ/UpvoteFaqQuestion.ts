// src/app/useCases/FAQ/UpvoteFaqQuestion.ts

import FaqRepository from "../../repositories/FaqRepository";
import { IFaq } from "../../../infra/databases/interfaces/IFaq";

export default class UpvoteFaqQuestion {
    private faqRepository: FaqRepository;

    constructor(faqRepository: FaqRepository) {
        this.faqRepository = faqRepository;
    }

    public async execute(faqId: string, userId: string): Promise<IFaq | null> {
        return await this.faqRepository.upvoteQuestion(faqId, userId);
    }
}