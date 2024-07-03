import jwt from 'jsonwebtoken';

interface TokenPayload {
    userId: string;
    username: string;
    email: string;
    image: string;
}

export default class TokenManager {
    public generateAccessToken(payload: TokenPayload): string {
        return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '15m' });
    }

    public generateRefreshToken(payload: TokenPayload): string {
        return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' });
    }

    public verifyToken(token: string, secret: string): string | object {
        return jwt.verify(token, secret);
    }
}
