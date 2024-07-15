import TokenManager from '../../../app/providers/TokenManager';

const tokenManager = new TokenManager();

const socketAuthMiddleware = (socket: any, next: (err?: Error) => void) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error('Authentication error'));
    }

    try {
        const decoded = tokenManager.verifyToken(token);
        socket.data.user = decoded;
        next();
    } catch (error) {
        next(new Error('Invalid token'));
    }
};

export default socketAuthMiddleware;