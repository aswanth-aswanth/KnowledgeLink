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
import GetRoadmapsByMemberController from "../../../infra/http/controllers/Roadmap/GetRoadmapsByMemberController";
import GetDiagramController from "../../../infra/http/controllers/Roadmap/GetDiagramController";
import authMiddleware from '../../../infra/http/middleware/authMiddleware';
import { report } from "process";

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
const getRoadmapsByMemberController = new GetRoadmapsByMemberController();
const getDiagramController = new GetDiagramController();

roadmapRouter.post("/", authMiddleware, createRoadmapController.handle);
roadmapRouter.post("/:id/contribute", authMiddleware, contributeToRoadmapController.handle);
roadmapRouter.get("/:id/contributions", authMiddleware, getContributionsController.handle);
roadmapRouter.patch("/:id/merge", authMiddleware, mergeContributionController.handle);
roadmapRouter.get("/member", authMiddleware, getRoadmapsByMemberController.handle);
roadmapRouter.get("/", getRoadmapsByTypeController.handle);
roadmapRouter.get("/admin", authMiddleware, getRoadmapsByAdminController.handle);
roadmapRouter.get("/subscribed", authMiddleware, getAllSubscribedController.handle);
roadmapRouter.get("/diagram/:id", getDiagramController.handle);
roadmapRouter.get("/:id/members", getAllRoadmapMembersController.handle);
roadmapRouter.get("/:id", getSingleRoadmapController.handle);

export default roadmapRouter;

/* 
highlight
report
connections following request
admin side
reported roadmaps
implement chat integration

elastic search
frontend otp

 */