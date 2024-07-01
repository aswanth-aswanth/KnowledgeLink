import { Router } from "express";
import SubscribeController from '../../../infra/http/controllers/Subscribe/SubscribeRoadmapController';
import GetUsersController from '../../../infra/http/controllers/GetUsersController';
import authMiddleware from '../../../infra/http/middleware/authMiddleware';

const profileRouter = Router();

const subscribeController = new SubscribeController();
const getUsersController = new GetUsersController();

profileRouter.post("/subscribe", authMiddleware, subscribeController.handle);
profileRouter.get("/users", getUsersController.handle);

export default profileRouter;