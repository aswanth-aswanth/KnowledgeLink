import { Router } from "express";
import GetRandomTopicsController from "../../../infra/http/controllers/GetRandomTopicsController";
import ProcessRoadmapsAndExtractDataController from "../../../infra/http/controllers/ProcessRoadmapsAndExtractDataController";
import GetPersonalizedTopicsController from "../../../infra/http/controllers/GetPersonalizedTopicsController";
import LogUserInteractionController from "../../../infra/http/controllers/LogUserInteractionController";
import authMiddleware from "../../../infra/http/middleware/authMiddleware";

const recommendationRouter = Router();
const getRandomTopicsController = new GetRandomTopicsController();
const processRoadmapsAndExtractDataController = new ProcessRoadmapsAndExtractDataController();
const getPersonalizedTopicsController = new GetPersonalizedTopicsController();
const logUserInteractionController = new LogUserInteractionController();

recommendationRouter.get("/random-topics", getRandomTopicsController.handle);
recommendationRouter.post("/process-roadmaps", processRoadmapsAndExtractDataController.handle);
recommendationRouter.get("/personalized-topics", authMiddleware, getPersonalizedTopicsController.handle);
recommendationRouter.post("/log-interaction", authMiddleware, logUserInteractionController.handle);

export default recommendationRouter;