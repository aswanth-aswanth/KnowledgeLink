import { Router } from "express";
import AuthenticateUserController from '../../../infra/http/controllers/Authenticate/AuthenticateUserController';
import CreateUserController from '../../../infra/http/controllers/User/CreateUserController';

const profileRouter = Router();

const authenticateUserController = new AuthenticateUserController();
const createUserController = new CreateUserController();

profileRouter.post("/", authenticateUserController.handle);
profileRouter.post("/register", createUserController.handle);
export default profileRouter;