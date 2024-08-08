// src/app/useCases/FAQ/AddFaqAnswer.ts

import FaqRepository from "../../repositories/FaqRepository";
import { IFaq, IAnswer } from "../../../infra/databases/interfaces/IFaq";

export default class AddFaqAnswer {
    private faqRepository: FaqRepository;

    constructor(faqRepository: FaqRepository) {
        this.faqRepository = faqRepository;
    }

    public async execute(
        faqId: string,
        content: string,
        authorId: string
    ): Promise<IFaq | null> {
        const answerData: Partial<IAnswer> = {
            content,
            authorId
        };

        return await this.faqRepository.addAnswer(faqId, answerData);
    }
}