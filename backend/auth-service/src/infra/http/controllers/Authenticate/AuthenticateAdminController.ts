import { Request, Response } from "express";
import AuthenticateAdmin from '../../../../app/useCases/Authenticate/implementations/AuthenticateAdmin';
import TokenManager from '../../../../app/providers/TokenManager';

export default class AuthenticateAdminController {
    public async handle(req: Request, res: Response): Promise<Response> {
        const { email, password } = req.body;
        const authenticateAdmin = new AuthenticateAdmin(
            new TokenManager()
        );
        try {
            const { token, refreshToken } = await authenticateAdmin.execute(email, password);

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
            return res.status(400).json({ error: "Unkown error" });
        }
    }
}