// src/presentation/express/routers/faq.ts

import { Router } from "express";
import AddFaqQuestionController from "../../../infra/http/controllers/FAQ/AddFaqQuestionController";
import AddFaqAnswerController from "../../../infra/http/controllers/FAQ/AddFaqAnswerController";
import GetFaqsByRoadmapAndTopicController from "../../../infra/http/controllers/FAQ/GetFaqsByRoadmapAndTopicController";
import UpvoteFaqQuestionController from "../../../infra/http/controllers/FAQ/UpvoteFaqQuestionController";
import UpvoteFaqAnswerController from "../../../infra/http/controllers/FAQ/UpvoteFaqAnswerController";
import authMiddleware from '../../../infra/http/middleware/authMiddleware';

const faqRouter = Router();

const addFaqQuestionController = new AddFaqQuestionController();
const addFaqAnswerController = new AddFaqAnswerController();
const getFaqsByRoadmapAndTopicController = new GetFaqsByRoadmapAndTopicController();
const upvoteFaqQuestionController = new UpvoteFaqQuestionController();
const upvoteFaqAnswerController = new UpvoteFaqAnswerController();

faqRouter.post("/question", authMiddleware, addFaqQuestionController.handle);
faqRouter.post("/answer", authMiddleware, addFaqAnswerController.handle);
faqRouter.get("/:roadmapId/:topicUniqueId", getFaqsByRoadmapAndTopicController.handle);
faqRouter.post("/question/:faqId/upvote", authMiddleware, upvoteFaqQuestionController.handle);
faqRouter.post("/answer/:faqId/:answerId/upvote", authMiddleware, upvoteFaqAnswerController.handle);

export default faqRouter;