import { Request, Response, NextFunction } from 'express';
import TokenManager from '../../../app/providers/TokenManager';

const tokenManager = new TokenManager();

const nonAuthMiddleware = (req: any, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        req.user = null;
        return next();
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        req.user = null;
        return next();
    }

    const token = parts[1];

    try {
        const decoded = tokenManager.verifyToken(token);
        req.user = decoded;
    } catch (error) {
        req.user = null;
    }
    next();
};

export default nonAuthMiddleware;