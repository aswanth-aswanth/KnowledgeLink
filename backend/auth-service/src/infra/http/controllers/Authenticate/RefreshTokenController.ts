// RefreshTokenController.ts
import { Request, Response } from "express";
import TokenManager from '../../../../app/providers/TokenManager';
import UserRepository from '../../../../app/repositories/UserRepository';

export default class RefreshTokenController {
    public async handle(req: Request, res: Response): Promise<Response> {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            return res.status(403).json({ error: "No refresh token" });
        }

        const tokenManager = new TokenManager();
        const userRepository = new UserRepository();

        try {
            const decoded = tokenManager.verifyRefreshToken(refreshToken) as { userId: string };
            const user = await userRepository.findById(decoded.userId);

            if (!user) {
                return res.status(403).json({ error: "User not found" });
            }

            const newAccessToken = tokenManager.generateAccessToken({
                userId: user._id,
                username: user.username,
                email: user.email,
                image: user.image,
                role: "user"
            });

            return res.json({ token: newAccessToken });
        } catch (error) {
            res.clearCookie('refreshToken');
            return res.status(403).json({ error: "Invalid refresh token" });
        }
    }
}