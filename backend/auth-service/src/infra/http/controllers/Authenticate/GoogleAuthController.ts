import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { IUser } from '../../../databases/mongoose/models/User';

dotenv.config();

class GoogleAuthController {
    public login(req: Request, res: Response): void {
        res.status(401).json({ error: 'Unauthorized' });
    }

    public callback(req: Request, res: Response): void {
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
                { expiresIn: '1h' }
            );
            res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
        } else {
            res.redirect(`${process.env.FRONTEND_URL}/sign-up?error=true`);
        }
    }
}

export default new GoogleAuthController();
