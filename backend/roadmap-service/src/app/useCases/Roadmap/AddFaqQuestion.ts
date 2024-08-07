import FaqRepository from "../../repositories/FaqRepository";
import { AddFaqQuestionDTO, IFAQ } from "../../../infra/databases/interfaces/IFaq";

export default class AddFaqQuestion {
    private faqRepository: FaqRepository;

    constructor(faqRepository: FaqRepository) {
        this.faqRepository = faqRepository;
    }

    public async execute(faqData: AddFaqQuestionDTO): Promise<string> {
        const newFaq = await this.faqRepository.create(faqData);
        return newFaq;
    }
}
