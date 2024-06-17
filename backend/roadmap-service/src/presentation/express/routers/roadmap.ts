import { Router } from "express";
import CreateRoadmapController from "../../../infra/http/controllers/Roadmap/CreateRoadmapController";
import ContributeToRoadmapController from "../../../infra/http/controllers/Roadmap/ContributeToRoadmapController";

const roadmapRouter = Router();
const createRoadmapController = new CreateRoadmapController();
const contributeToRoadmapController = new ContributeToRoadmapController();

roadmapRouter.post("/roadmap", createRoadmapController.handle);
roadmapRouter.post("/roadmap/:id/contribute", contributeToRoadmapController.handle);


export default roadmapRouter;