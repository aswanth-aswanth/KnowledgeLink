import { Router } from "express";
import GetUsersController from '../../../infra/http/controllers/GetUsersController';
import GetSingleUserController from '../../../infra/http/controllers/GetSingleUserController';
import FollowUserController from '../../../infra/http/controllers/FollowUserController';
import GetSearchUsersController from '../../../infra/http/controllers/GetSearchUsersController';
import authMiddleware from '../../../infra/http/middleware/authMiddleware';
import nonAuthMiddleware from '../../../infra/http/middleware/nonAuthMiddleware';

const postRouter = Router();

const subscribeController = new SubscribeController();
const getUsersController = new GetUsersController();
const getSingleUserController = new GetSingleUserController();
const getSearchUsersController = new GetSearchUsersController();
const followUserController = new FollowUserController();

postRouter.post("/", authMiddleware, subscribeController.handle);
postRouter.get("/users", getUsersController.handle);
postRouter.get("/search", getSearchUsersController.handle);
postRouter.get("/user/:id", nonAuthMiddleware, getSingleUserController.handle);
postRouter.patch("/user/:email/follow", authMiddleware, followUserController.handle);

export default postRouter;