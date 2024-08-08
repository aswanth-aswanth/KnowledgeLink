// src/app/repositories/FaqRepository.ts

import Faq from "../../infra/databases/mongoose/models/Faq";
import { IFaq, IAnswer } from "../../infra/databases/interfaces/IFaq";
import { Types } from "mongoose";

export default class FaqRepository {
  public async create(faqData: Partial<IFaq>): Promise<IFaq> {
    const newFaq = new Faq(faqData);
    return await newFaq.save();
  }

  public async findByRoadmapAndTopic(roadmapId: string, topicUniqueId: string): Promise<IFaq[]> {
    return await Faq.find({ roadmapId, topicUniqueId }).sort({ upvotes: -1 }).exec();
  }

  public async addAnswer(faqId: string, answerData: Partial<IAnswer>): Promise<IFaq | null> {
    return await Faq.findByIdAndUpdate(
      faqId,
      { $push: { answers: answerData } },
      { new: true }
    ).exec();
  }

  public async upvoteQuestion(faqId: string, userId: string): Promise<IFaq | null> {
    return await Faq.findByIdAndUpdate(
      faqId,
      { $addToSet: { upvotes: userId } },
      { new: true }
    ).exec();
  }

  public async upvoteAnswer(faqId: string, answerId: string, userId: string): Promise<IFaq | null> {
    return await Faq.findOneAndUpdate(
      { _id: faqId, "answers._id": answerId },
      { $addToSet: { "answers.$.upvotes": userId } },
      { new: true }
    ).exec();
  }
}