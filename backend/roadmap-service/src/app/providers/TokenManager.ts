import jwt from 'jsonwebtoken';

interface TokenPayload {
    userId: string;
    username: string;
    email: string;
    image: string;
}

export default class TokenManager {
    public verifyToken(token: string): string | object {
        return jwt.verify(token, process.env.JWT_SECRET!);
    }
}
