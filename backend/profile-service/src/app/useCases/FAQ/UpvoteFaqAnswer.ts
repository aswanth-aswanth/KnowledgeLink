// src/app/useCases/FAQ/UpvoteFaqAnswer.ts

import FaqRepository from "../../repositories/FaqRepository";
import { IFaq } from "../../../infra/databases/interfaces/IFaq";

export default class UpvoteFaqAnswer {
    private faqRepository: FaqRepository;

    constructor(faqRepository: FaqRepository) {
        this.faqRepository = faqRepository;
    }

    public async execute(faqId: string, answerId: string, userId: string): Promise<IFaq | null> {
        return await this.faqRepository.upvoteAnswer(faqId, answerId, userId);
    }
}