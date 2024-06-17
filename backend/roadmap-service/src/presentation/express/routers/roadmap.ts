import { Router } from "express";
import CreateRoadmapController from "../../../infra/http/controllers/Roadmap/CreateRoadmapController";
import ContributeToRoadmapController from "../../../infra/http/controllers/Roadmap/ContributeToRoadmapController";
import GetContributionsController from "../../../infra/http/controllers/Roadmap/GetContributionController";

const roadmapRouter = Router();
const createRoadmapController = new CreateRoadmapController();
const contributeToRoadmapController = new ContributeToRoadmapController();
const getContributionsController = new GetContributionsController();

roadmapRouter.post("/roadmap", createRoadmapController.handle);
roadmapRouter.post("/roadmap/:id/contribute", contributeToRoadmapController.handle);
roadmapRouter.get("/roadmap/:id/contributions", getContributionsController.handle);



export default roadmapRouter;