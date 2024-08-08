import jwt from 'jsonwebtoken';

interface TokenPayload {
    userId: string;
    username: string;
    email: string;
    image: string;
    role?: string;
}

export default class TokenManager {
    public generateToken(payload: TokenPayload): string {
        const token = jwt.sign(payload, process.env.JWT_SECRET!, {
            expiresIn: '7d'
        });
        return token;
    }

    public verifyToken(token: string): string | object {
        return jwt.verify(token, process.env.JWT_SECRET!);
    }
}
