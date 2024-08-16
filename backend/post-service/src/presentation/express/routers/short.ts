import { Router } from "express";
import authMiddleware from '../../../infra/http/middleware/authMiddleware';
import CreateShortController from '../../../infra/http/controllers/CreateShortController.ts';
import GetRecommendedShortsController from '../../../infra/http/controllers/GetRecommendedShortsController';
import LikeShortController from '../../../infra/http/controllers/LikeShortController';
import UnlikeShortController from '../../../infra/http/controllers/UnlikeShortController';

const shortRouter = Router();

const createShortController = new CreateShortController();
const getRecommendedShortsController = new GetRecommendedShortsController();
const likeShortController = new LikeShortController();
const unlikeShortController = new UnlikeShortController();

shortRouter.post("/", authMiddleware, createShortController.handle);
shortRouter.get("/recommended", authMiddleware, getRecommendedShortsController.handle);
shortRouter.post("/:shortId/like", authMiddleware, likeShortController.handle);
shortRouter.post("/:shortId/unlike", authMiddleware, unlikeShortController.handle);

export default shortRouter;