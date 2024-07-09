import { Router } from "express";
import authMiddleware from '../../../infra/http/middleware/authMiddleware';
import GetNotificationController from '../../../infra/http/controllers/GetNotificationController';
import MarkAsReadController from '../../../infra/http/controllers/MarkAsReadController';
import GetNotificationCountController from '../../../infra/http/controllers/GetNotificationCountController';

const notificationRouter = Router();

const getNotificationController = new GetNotificationController();
const markAsReadController = new MarkAsReadController();
const getNotificationCountController = new GetNotificationCountController();


notificationRouter.get("/", authMiddleware, getNotificationController.handle);
notificationRouter.get("/count", authMiddleware, getNotificationCountController.handle);
notificationRouter.patch("/mark-read", authMiddleware, markAsReadController.handle);


export default notificationRouter; 