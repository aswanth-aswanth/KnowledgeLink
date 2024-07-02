import { Router } from "express";
import SubscribeController from '../../../infra/http/controllers/Subscribe/SubscribeRoadmapController';
import GetUsersController from '../../../infra/http/controllers/GetUsersController';
import GetSingleUserController from '../../../infra/http/controllers/GetSingleUserController';
import authMiddleware from '../../../infra/http/middleware/authMiddleware';

const profileRouter = Router();

const subscribeController = new SubscribeController();
const getUsersController = new GetUsersController();
const getSingleUserController = new GetSingleUserController();

profileRouter.post("/subscribe", authMiddleware, subscribeController.handle);
profileRouter.get("/users", getUsersController.handle);
profileRouter.get("/user/:id", getSingleUserController.handle);

export default profileRouter;