import jwt from 'jsonwebtoken';

export default class TokenManager {

    public verifyToken(token: string): string | object {
        return jwt.verify(token, process.env.JWT_SECRET!);
    }
}

