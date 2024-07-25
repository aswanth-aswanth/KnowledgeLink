import { Router } from "express";
import GetRandomTopicsController from "../../../infra/http/controllers/GetRandomTopicsController";
// import ProcessRoadmapsAndExtractDataController from "../../../infra/http/controllers/ProcessRoadmapsAndExtractDataController";

const recommendationRouter = Router();
const getRandomTopicsController = new GetRandomTopicsController();
// const processRoadmapsAndExtractDataController = new ProcessRoadmapsAndExtractDataController();

recommendationRouter.get("/random-topics", getRandomTopicsController.handle);
// recommendationRouter.post("/process-roadmaps", processRoadmapsAndExtractDataController.handle);

export default recommendationRouter;