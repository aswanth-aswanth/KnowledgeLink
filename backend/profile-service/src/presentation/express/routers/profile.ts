import { Router } from "express";
import SubscribeController from '../../../infra/http/controllers/Subscribe/SubscribeRoadmapController';
import authMiddleware from '../../../infra/http/middleware/authMiddleware';

const profileRouter = Router();

const subscribeController = new SubscribeController();

profileRouter.post("/subscribe", authMiddleware, subscribeController.handle);

export default profileRouter;