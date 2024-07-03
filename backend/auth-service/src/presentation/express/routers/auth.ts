import { Router } from 'express';
import passport from '../../../infra/http/middleware/passport';
import AuthenticateUserController from '../../../infra/http/controllers/Authenticate/AuthenticateUserController';
import RefreshTokenController from '../../../infra/http/controllers/Authenticate/RefreshTokenController';
import CreateUserController from '../../../infra/http/controllers/User/CreateUserController';
import GoogleAuthController from '../../../infra/http/controllers/Authenticate/GoogleAuthController';

const authRouter = Router();

const authenticateUserController = new AuthenticateUserController();
const refreshTokenController = new RefreshTokenController();
const createUserController = new CreateUserController();

authRouter.post('/login', authenticateUserController.handle);
authRouter.post('/refresh-token', (req, res) => refreshTokenController.handle(req, res));
authRouter.post('/register', createUserController.handle);

// Google OAuth routes
authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
authRouter.get('/google/callback', passport.authenticate('google', {
    failureRedirect: `${process.env.FRONTEND_URL}/sign-up?error=true`
}), GoogleAuthController.callback);

export default authRouter;