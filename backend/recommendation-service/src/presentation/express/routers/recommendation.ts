import { Router } from "express";
import GetRandomTopicsController from "../../../infra/http/controllers/GetRandomTopicsController";
// import authMiddleware from '../../../infra/http/middleware/authMiddleware';

const recommendationRouter = Router();
const getRandomTopicsController = new GetRandomTopicsController();

recommendationRouter.get("/random-topics", getRandomTopicsController.handle);

export default recommendationRouter;