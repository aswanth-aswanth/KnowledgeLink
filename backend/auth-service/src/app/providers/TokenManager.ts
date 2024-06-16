import jwt from 'jsonwebtoken';

export default class TokenManager {
    public generateToken(userId: string): string {
        const token = jwt.sign({ userId }, 'secret', {
            expiresIn: '1h'
        })
        return token;
    }
    public verifyToken(token: string): string | object {
        return jwt.verify(token, 'secret');
    }
}

