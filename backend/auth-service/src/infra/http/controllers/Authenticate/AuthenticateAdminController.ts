import { Request, Response } from "express";
import AuthenticateAdmin from '../../../../app/useCases/Authenticate/implementations/AuthenticateAdmin';
import UserRepository from '../../../../app/repositories/UserRepository';
import PasswordHasher from '../../../../app/providers/PasswordHasher';
import TokenManager from '../../../../app/providers/TokenManager';

export default class AuthenticateAdminController {
    public async handle(req: Request, res: Response): Promise<Response> {
        const { email, password } = req.body;
        const authenticateAdmin = new AuthenticateAdmin(
            new UserRepository(),
            new PasswordHasher(),
            new TokenManager()
        );
        try {
            const token = await authenticateAdmin.execute(email, password);
            return res.json({ token });
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ error: err.message });
            }
            return res.status(400).json({ error: "Unkown error" });
        }
    }
}