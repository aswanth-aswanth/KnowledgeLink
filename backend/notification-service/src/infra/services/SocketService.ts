// src/infra/services/SocketService.ts

import { Server as SocketIOServer } from 'socket.io';

class SocketService {
    private static instance: SocketService;
    private io!: SocketIOServer;
    private userSockets: Map<string, string> = new Map();

    private constructor() { }

    static getInstance() {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }

    setIO(io: SocketIOServer) {
        this.io = io;
        this.setupSocketConnections();
    }

    private setupSocketConnections() {
        this.io.on('connection', (socket) => {
            console.log('New client connected');

            socket.on('register', (email: string) => {
                this.userSockets.set(email, socket.id);
                console.log(`User ${email} registered`);
            });

            socket.on('disconnect', () => {
                const email = this.findUserBySocketId(socket.id);
                if (email) {
                    this.userSockets.delete(email);
                    console.log(`User ${email} disconnected`);
                }
            });
        });
    }

    private findUserBySocketId(socketId: string): string | undefined {
        for (const [email, id] of this.userSockets.entries()) {
            if (id === socketId) {
                return email;
            }
        }
        return undefined;
    }

    public sendNotification(email: string, notification: any) {
        const socketId = this.userSockets.get(email);
        if (socketId) {
            this.io.to(socketId).emit('notification', notification);
        } else {
            console.log(`User ${email} is not connected`);
        }
    }
}

export default SocketService;