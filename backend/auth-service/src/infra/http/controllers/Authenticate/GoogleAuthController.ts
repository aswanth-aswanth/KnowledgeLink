import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { IUser } from '../../../databases/mongoose/models/User';
import TokenManager from '../../../../app/providers/TokenManager';

dotenv.config();

class GoogleAuthController {
    public login(req: Request, res: Response): void {
        res.status(401).json({ error: 'Unauthorized' });
    }

    public callback(req: Request, res: Response): void {
        const tokenManager = new TokenManager();
        const user = req.user as IUser;
        if (user) {
            const token = jwt.sign(
                {
                    userId: user._id,
                    username: user.username,
                    email: user.email,
                    image: user.image,
                    role: "user"
                },
                process.env.JWT_SECRET!,
                { expiresIn: '7d' }
            );
            const refreshToken = tokenManager.generateRefreshToken(user._id);
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
            res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
        } else {
            res.redirect(`${process.env.FRONTEND_URL}/sign-up?error=true`);
        }
    }
}

export default new GoogleAuthController();
