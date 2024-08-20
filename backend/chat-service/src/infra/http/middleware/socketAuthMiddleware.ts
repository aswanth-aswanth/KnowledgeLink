import TokenManager from '../../../app/providers/TokenManager';

const tokenManager = new TokenManager();

const socketAuthMiddleware = (socket: any, next: (err?: Error) => void) => {
    const token = socket.handshake.auth.token;
    console.log("Socket auth middleware : ", socket.handshake.auth);
    if (!token) {
        return next(new Error('Authentication error'));
    }

    try {
        const decoded = tokenManager.verifyToken(token);
        console.log("decoded from socketAuthMiddleware : ", decoded);
        socket.data.user = decoded;
        next();
    } catch (error) {
        next(new Error('Invalid token'));
    }
};

export default socketAuthMiddleware;