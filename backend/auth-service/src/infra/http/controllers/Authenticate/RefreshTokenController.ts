import { Request, Response } from "express";
import TokenManager from '../../../../app/providers/TokenManager';

export default class RefreshTokenController {
    public async handle(req: Request, res: Response): Promise<Response> {
        const { refreshToken } = req.body;
        const tokenManager = new TokenManager();

        try {
            const decoded = tokenManager.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET!);

            if (typeof decoded === 'string') {
                throw new Error('Invalid token');
            }

            const { userId, username, email, image } = decoded as any;

            const newAccessToken = tokenManager.generateAccessToken({ userId, username, email, image });
            const newRefreshToken = tokenManager.generateRefreshToken({ userId, username, email, image });

            return res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ error: err.message });
            }
            return res.status(400).json({ error: "Unknown error" });
        }
    }
}
