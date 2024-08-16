import { Router } from 'express';
import passport from '../../../infra/http/middleware/passport';
import AuthenticateUserController from '../../../infra/http/controllers/Authenticate/AuthenticateUserController';
import LogoutUserController from '../../../infra/http/controllers/Authenticate/LogoutUserController';
import AuthenticateAdminController from '../../../infra/http/controllers/Authenticate/AuthenticateAdminController';
import CreateUserController from '../../../infra/http/controllers/User/CreateUserController';
import GoogleAuthController from '../../../infra/http/controllers/Authenticate/GoogleAuthController';
import RefreshTokenController from '../../../infra/http/controllers/Authenticate/RefreshTokenController';

const authRouter = Router();

const authenticateUserController = new AuthenticateUserController();
const authenticateAdminController = new AuthenticateAdminController();
const createUserController = new CreateUserController();
const refreshTokenController = new RefreshTokenController();
const logoutUserController = new LogoutUserController();

authRouter.post('/login', authenticateUserController.handle);
authRouter.post('/logout', logoutUserController.handle);
authRouter.post('/refresh-token', refreshTokenController.handle);
authRouter.post('/adminlogin', authenticateAdminController.handle);
authRouter.post('/register', createUserController.handle);

// Google OAuth routes
authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
authRouter.get('/google/callback', passport.authenticate('google', {
    failureRedirect: `${process.env.FRONTEND_URL}/sign-up?error=true`
}), GoogleAuthController.callback);

export default authRouter;