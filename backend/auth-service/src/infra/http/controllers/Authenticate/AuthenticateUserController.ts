// AuthenticateUserController.ts
import { Request, Response } from "express";
import AuthenticateUser from '../../../../app/useCases/Authenticate/implementations/AuthenticateUser';
import UserRepository from '../../../../app/repositories/UserRepository';
import PasswordHasher from '../../../../app/providers/PasswordHasher';
import TokenManager from '../../../../app/providers/TokenManager';

export default class AuthenticateUserController {
    public async handle(req: Request, res: Response): Promise<Response> {
        const { email, password } = req.body;
        const authenticateUser = new AuthenticateUser(
            new UserRepository(),
            new PasswordHasher(),
            new TokenManager()
        );
        try {
            const { token, refreshToken } = await authenticateUser.execute(email, password);

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            return res.json({ token });
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ error: err.message });
            }
            return res.status(400).json({ error: "Unknown error" });
        }
    }
}