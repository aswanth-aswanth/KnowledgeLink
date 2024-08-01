import { Router } from "express";
import authMiddleware from '../../../infra/http/middleware/authMiddleware';
import CreateMeetingController from '../../../infra/http/controllers/CreateMeetingController';
import GetUserMeetingsController from '../../../infra/http/controllers/GetUserMeetingsController';

const meetingRouter = Router();

const createMeetingController = new CreateMeetingController();
const getUserMeetingsController = new GetUserMeetingsController();

meetingRouter.post("/", authMiddleware, createMeetingController.handle);
meetingRouter.get("/", authMiddleware, getUserMeetingsController.handle);

export default meetingRouter;