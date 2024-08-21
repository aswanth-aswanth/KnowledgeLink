import { Namespace, Socket } from 'socket.io';
import socketAuthMiddleware from '../http/middleware/socketAuthMiddleware';
import SendMessage from '../../app/useCases/SendMessage';
import ChatRepository from '../../app/repositories/ChatRepository';
import MarkMessageAsRead from '../../app/useCases/MarkMessageAsRead';

class SocketService {
  private static instance: SocketService;
  private io!: Namespace;
  private userSockets: Map<string, string> = new Map();

  private constructor() { }

  static getInstance() {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  setIO(io: Namespace) {
    this.io = io;
    this.setupMiddleware();
    this.setupSocketConnections();
  }

  private setupMiddleware() {
    this.io.use(socketAuthMiddleware);
  }

  private setupSocketConnections() {
    this.io.on('connection', (socket: Socket) => {
      console.log('New client connected');
      console.log('User connected:', socket.data.user.userId);
      this.userSockets.set(socket.data.user.userId, socket.id);

      socket.on('join_room', (chatId: string) => {
        console.log(`User ${socket.data.user.userId} joining room ${chatId}`);
        socket.join(chatId);
      });

      // Rest of the code remains the same
    });

    this.io.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });
  }

  public emitToUser(userId: string, event: string, data: any): void {
    const socketId = this.userSockets.get(userId);
    if (socketId) {
      this.io.to(socketId).emit(event, data);
    } else {
      console.log(`User ${userId} is not connected`);
    }
  }

  public emitToChat(chatId: string, event: string, data: any) {
    console.log(`Emitting '${event}' to chat ${chatId}:`, data);
    this.io.to(chatId).emit(event, data);
  }
}

export default SocketService;