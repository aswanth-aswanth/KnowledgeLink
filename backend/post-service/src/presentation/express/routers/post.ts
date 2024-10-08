import { Router } from "express";
import authMiddleware from '../../../infra/http/middleware/authMiddleware';
import nonAuthMiddleware from '../../../infra/http/middleware/nonAuthMiddleware';
import CreatePostController from '../../../infra/http/controllers/CreatePostController';
import LikePostController from '../../../infra/http/controllers/LikePostController';
import CommentPostController from '../../../infra/http/controllers/CommentPostController';
import ReplyCommentController from '../../../infra/http/controllers/ReplyCommentController';
import DeleteCommentController from '../../../infra/http/controllers/DeleteCommentController';
import DeleteReplyController from '../../../infra/http/controllers/DeleteReplyController';
import GetPostsController from '../../../infra/http/controllers/GetPostsController';
import GetCommentsController from '../../../infra/http/controllers/GetCommentsController';
import GetRepliesController from '../../../infra/http/controllers/GetRepliesController';
import GetUserPostsController from '../../../infra/http/controllers/GetUserPostsController';
import GetUserPostController from '../../../infra/http/controllers/GetUserPostController';
import GetSavedPostsController from '../../../infra/http/controllers/GetSavedPostsController';

const postRouter = Router();

const createPostController = new CreatePostController();
const likePostController = new LikePostController();
const commentPostController = new CommentPostController();
const replyCommentController = new ReplyCommentController();
const deleteCommentController = new DeleteCommentController();
const deleteReplyController = new DeleteReplyController();
const getPostsController = new GetPostsController();
const getCommentsController = new GetCommentsController();
const getRepliesController = new GetRepliesController();
const getUserPostsController = new GetUserPostsController();
const getUserPostController = new GetUserPostController();
const getSavedPostsController = new GetSavedPostsController();

postRouter.post("/", authMiddleware, createPostController.handle);
postRouter.put("/like/:id", authMiddleware, likePostController.handle);
postRouter.post("/comment", authMiddleware, commentPostController.handle);
postRouter.patch("/comment", authMiddleware, deleteCommentController.handle);
postRouter.post("/reply", authMiddleware, replyCommentController.handle);
postRouter.patch("/reply", authMiddleware, deleteReplyController.handle);
postRouter.get("/posts", authMiddleware, getPostsController.handle);
postRouter.get("/saved-posts", authMiddleware, getSavedPostsController.handle);
postRouter.get("/posts/:postId", nonAuthMiddleware, getUserPostController.handle);
postRouter.get("/comments/:postId", nonAuthMiddleware, getCommentsController.handle);
postRouter.get("/replies/:commentId", nonAuthMiddleware, getRepliesController.handle);
postRouter.get("/user-posts/:email", nonAuthMiddleware, getUserPostsController.handle);

export default postRouter;
