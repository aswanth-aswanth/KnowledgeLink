import { Router } from "express";
import authMiddleware from '../../../infra/http/middleware/authMiddleware';
import CreateShortController from '../../../infra/http/controllers/CreateShortController';
import GetRecommendedShortsController from '../../../infra/http/controllers/GetRecommendedShortsController';
import LikeShortController from '../../../infra/http/controllers/LikeShortController';
import UnlikeShortController from '../../../infra/http/controllers/UnlikeShortController';
import nonAuthMiddleware from "../../../infra/http/middleware/nonAuthMiddleware";

const shortRouter = Router();

const createShortController = new CreateShortController();
const getRecommendedShortsController = new GetRecommendedShortsController();
const likeShortController = new LikeShortController();
const unlikeShortController = new UnlikeShortController();

shortRouter.post("/", authMiddleware, createShortController.handle);
shortRouter.get("/recommended", nonAuthMiddleware, getRecommendedShortsController.handle);
shortRouter.post("/:shortId/like", authMiddleware, likeShortController.handle);
shortRouter.post("/:shortId/unlike", authMiddleware, unlikeShortController.handle);

export default shortRouter;