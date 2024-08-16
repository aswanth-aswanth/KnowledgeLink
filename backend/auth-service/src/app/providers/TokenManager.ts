// TokenManager.ts
import jwt from 'jsonwebtoken';

interface AccessTokenPayload {
    userId: string;
    username: string;
    email: string;
    image: string;
    role?: string;
}

export default class TokenManager {
    public generateAccessToken(payload: AccessTokenPayload): string {
        return jwt.sign(payload, process.env.JWT_SECRET!, {
            expiresIn: '15m'
        });
    }

    public generateRefreshToken(userId: string): string {
        return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, {
            expiresIn: '7d'
        });
    }

    public verifyAccessToken(token: string): string | object {
        return jwt.verify(token, process.env.JWT_SECRET!);
    }

    public verifyRefreshToken(token: string): string | object {
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
    }
}