import { Router } from "express";
import SubscribeController from '../../../infra/http/controllers/Subscribe/SubscribeRoadmapController';

const profileRouter = Router();

const subscribeController = new SubscribeController();

profileRouter.post("/subscribe", subscribeController.handle);

export default profileRouter;