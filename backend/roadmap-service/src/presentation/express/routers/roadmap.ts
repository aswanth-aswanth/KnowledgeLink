import { Router } from "express";
import CreateRoadmapController from "../../../infra/http/controllers/Roadmap/CreateRoadmapController";
import ContributeToRoadmapController from "../../../infra/http/controllers/Roadmap/ContributeToRoadmapController";
import GetContributionsController from "../../../infra/http/controllers/Roadmap/GetContributionController";
import MergeContributionController from "../../../infra/http/controllers/Roadmap/MergeContributionController";
import GetSingleRoadmapController from "../../../infra/http/controllers/Roadmap/GetSingleRoadmapController";

const roadmapRouter = Router();
const createRoadmapController = new CreateRoadmapController();
const contributeToRoadmapController = new ContributeToRoadmapController();
const getContributionsController = new GetContributionsController();
const mergeContributionController = new MergeContributionController();
const getSingleRoadmapController = new GetSingleRoadmapController();

roadmapRouter.post("/roadmap", createRoadmapController.handle);
roadmapRouter.post("/roadmap/:id/contribute", contributeToRoadmapController.handle);
roadmapRouter.get("/roadmap/:id/contributions", getContributionsController.handle);
roadmapRouter.patch("/roadmap/:id/merge", mergeContributionController.handle);
roadmapRouter.get("/roadmap/:id", getSingleRoadmapController.handle);



export default roadmapRouter;