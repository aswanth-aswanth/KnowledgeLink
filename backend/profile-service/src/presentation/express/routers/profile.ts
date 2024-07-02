import { Router } from "express";
import SubscribeController from '../../../infra/http/controllers/Subscribe/SubscribeRoadmapController';
import GetUsersController from '../../../infra/http/controllers/GetUsersController';
import GetSingleUserController from '../../../infra/http/controllers/GetSingleUserController';
import FollowUserController from '../../../infra/http/controllers/FollowUserController';
import authMiddleware from '../../../infra/http/middleware/authMiddleware';
import nonAuthMiddleware from '../../../infra/http/middleware/nonAuthMiddleware';

const profileRouter = Router();

const subscribeController = new SubscribeController();
const getUsersController = new GetUsersController();
const getSingleUserController = new GetSingleUserController();
const followUserController = new FollowUserController();

profileRouter.post("/subscribe", authMiddleware, subscribeController.handle);
profileRouter.get("/users", getUsersController.handle);
profileRouter.get("/user/:id", nonAuthMiddleware, getSingleUserController.handle);
profileRouter.patch("/user/:email/follow", authMiddleware, followUserController.handle);

export default profileRouter;