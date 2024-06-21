import { Router } from "express";
import CreateRoadmapController from "../../../infra/http/controllers/Roadmap/CreateRoadmapController";
import ContributeToRoadmapController from "../../../infra/http/controllers/Roadmap/ContributeToRoadmapController";
import GetContributionsController from "../../../infra/http/controllers/Roadmap/GetContributionController";
import MergeContributionController from "../../../infra/http/controllers/Roadmap/MergeContributionController";
import GetSingleRoadmapController from "../../../infra/http/controllers/Roadmap/GetSingleRoadmapController";
import GetAllSubscribedController from "../../../infra/http/controllers/Roadmap/GetAllSubscribedController";
import GetRoadmapsByTypeController from "../../../infra/http/controllers/Roadmap/GetRoadmapsByTypeController";
import GetRoadmapsByAdminController from "../../../infra/http/controllers/Roadmap/GetRoadmapsByAdminController";
import GetAllRoadmapMembersController from "../../../infra/http/controllers/Roadmap/GetAllRoadmapMembersController";

const roadmapRouter = Router();
const createRoadmapController = new CreateRoadmapController();
const contributeToRoadmapController = new ContributeToRoadmapController();
const getContributionsController = new GetContributionsController();
const mergeContributionController = new MergeContributionController();
const getSingleRoadmapController = new GetSingleRoadmapController();
const getAllSubscribedController = new GetAllSubscribedController();
const getRoadmapsByTypeController = new GetRoadmapsByTypeController();
const getRoadmapsByAdminController = new GetRoadmapsByAdminController();
const getAllRoadmapMembersController = new GetAllRoadmapMembersController();

roadmapRouter.post("/roadmap", createRoadmapController.handle);
roadmapRouter.post("/roadmap/:id/contribute", contributeToRoadmapController.handle);
roadmapRouter.get("/roadmap/:id/contributions", getContributionsController.handle);
roadmapRouter.patch("/roadmap/:id/merge", mergeContributionController.handle);
roadmapRouter.get("/roadmap", getRoadmapsByTypeController.handle);
roadmapRouter.get("/roadmap/admin", getRoadmapsByAdminController.handle);
roadmapRouter.get("/roadmap/subscribed", getAllSubscribedController.handle);
roadmapRouter.get("/roadmap/:id", getSingleRoadmapController.handle);
roadmapRouter.get("/roadmap/:id/members", getAllRoadmapMembersController.handle);




export default roadmapRouter;