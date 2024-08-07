import { AddFaqQuestionDTO, IFAQ } from "../../infra/databases/interfaces/IFaq";
import FAQ from "../../infra/databases/mongoose/models/Faq";

export default class FaqRepository {
    public async create(faqData: AddFaqQuestionDTO): Promise<string> {
        try {
            const newFaq = new FAQ({
                ...faqData,
                likes: [],
                upvotes: [],
                answers: [],
                createdAt: new Date()
            });
            return "faq added successfully"
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error creating contribution: ${error.message}`);
                throw new Error('Failed to create contribution');
            } else {
                console.error('Unknown error creating contribution');
                throw new Error('Unknown error');
            }
        }
    }
}
