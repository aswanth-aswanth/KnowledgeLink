import { Router } from "express";
import authMiddleware from '../../../infra/http/middleware/authMiddleware';
import nonAuthMiddleware from '../../../infra/http/middleware/nonAuthMiddleware';
import CreatePostController from '../../../infra/http/controllers/CreatePostController';

const postRouter = Router();

const createPostController = new CreatePostController();


postRouter.post("/", authMiddleware, createPostController.handle);

export default postRouter;