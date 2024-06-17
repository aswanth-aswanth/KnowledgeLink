import { Router } from "express";
import CreateRoadmapController from "../../../infra/http/controllers/Roadmap/CreateRoadmapController";

const roadmapRouter = Router();
const createRoadmapController = new CreateRoadmapController();

roadmapRouter.post("/roadmap", createRoadmapController.handle);


export default roadmapRouter;