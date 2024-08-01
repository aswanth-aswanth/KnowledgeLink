// src/presentation/express/routers/profile.ts
import { Router } from 'express';
import SubscribeController from '../../../infra/http/controllers/Subscribe/SubscribeRoadmapController';
import GetUsersController from '../../../infra/http/controllers/GetUsersController';
import GetSingleUserController from '../../../infra/http/controllers/GetSingleUserController';
import FollowUserController from '../../../infra/http/controllers/FollowUserController';
import GetSearchUsersController from '../../../infra/http/controllers/GetSearchUsersController';
import UpdateUserProfileController from '../../../infra/http/controllers/UpdateUserProfileController';
import authMiddleware from '../../../infra/http/middleware/authMiddleware';
import nonAuthMiddleware from '../../../infra/http/middleware/nonAuthMiddleware';
import GetPaginatedUsersController from '../../../infra/http/controllers/GetPaginatedUsersController';
import GetFollowersController from '../../../infra/http/controllers/GetFollowersController';
import { uploadSingle } from '../../../infra/http/middleware/imageUpload';

const profileRouter = Router();

const subscribeController = new SubscribeController();
const getUsersController = new GetUsersController();
const getSingleUserController = new GetSingleUserController();
const getSearchUsersController = new GetSearchUsersController();
const followUserController = new FollowUserController();
const updateUserProfileController = new UpdateUserProfileController();
const getPaginatedUsersController = new GetPaginatedUsersController();
const getFollowersController = new GetFollowersController();

profileRouter.post("/subscribe", authMiddleware, subscribeController.handle);
profileRouter.get("/users", getUsersController.handle);
profileRouter.get("/users/paginated", getPaginatedUsersController.handle);
profileRouter.get("/search", getSearchUsersController.handle);
profileRouter.get("/user/:id", nonAuthMiddleware, getSingleUserController.handle);
profileRouter.patch("/user/:id/follow", authMiddleware, followUserController.handle);
profileRouter.patch("/user", authMiddleware, uploadSingle('Roadmap'), updateUserProfileController.handle);
profileRouter.get("/user/:id/followers", getFollowersController.handle);

export default profileRouter;
