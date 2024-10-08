import { Request, Response, NextFunction } from 'express';
import TokenManager from '../../../app/providers/TokenManager';

const tokenManager = new TokenManager();

const authMiddleware = (req: any, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        req.user = null;
        return next();
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ message: 'Token error' });
    }

    const token = parts[1];

    try {
        const decoded = tokenManager.verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

export default authMiddleware;
