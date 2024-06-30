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
import authMiddleware from '../../../infra/http/middleware/authMiddleware';

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

roadmapRouter.post("/", authMiddleware, createRoadmapController.handle);
roadmapRouter.post("/:id/contribute", contributeToRoadmapController.handle);
roadmapRouter.get("/:id/contributions", getContributionsController.handle);
roadmapRouter.patch("/:id/merge", mergeContributionController.handle);
roadmapRouter.get("/", getRoadmapsByTypeController.handle);
roadmapRouter.get("/admin", getRoadmapsByAdminController.handle);
roadmapRouter.get("/subscribed", getAllSubscribedController.handle);
roadmapRouter.get("/:id/members", getAllRoadmapMembersController.handle);
roadmapRouter.get("/:id", getSingleRoadmapController.handle);




export default roadmapRouter;