import { Router } from "express";
import authMiddleware from '../../../infra/http/middleware/authMiddleware';
import nonAuthMiddleware from '../../../infra/http/middleware/nonAuthMiddleware';
import CreatePostController from '../../../infra/http/controllers/CreatePostController';
import LikePostController from '../../../infra/http/controllers/LikePostController';

const postRouter = Router();

const createPostController = new CreatePostController();
const likePostController = new LikePostController();


postRouter.post("/", authMiddleware, createPostController.handle);
postRouter.put("/like/:id", authMiddleware, likePostController.handle);

export default postRouter;