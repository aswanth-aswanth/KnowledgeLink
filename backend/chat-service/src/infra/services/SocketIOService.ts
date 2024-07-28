import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import socketAuthMiddleware from '../http/middleware/socketAuthMiddleware';
import SendMessage from '../../app/useCases/SendMessage';
import ChatRepository from '../../app/repositories/ChatRepository';

export default class SocketIOService {
  private io: Server;
  private userSockets: Map<string, string> = new Map();

  constructor(httpServer: HttpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });
    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware() {
    this.io.use(socketAuthMiddleware);
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log('User connected:', socket.data.user.id);
      this.userSockets.set(socket.data.user.id, socket.id);

      socket.on('join_chat', (chatId) => {
        socket.join(chatId);
        console.log(`User ${socket.data.user.id} joined chat ${chatId}`);
      });

      socket.on('leave_chat', (chatId) => {
        socket.leave(chatId);
        console.log(`User ${socket.data.user.id} left chat ${chatId}`);
      });

      socket.on('send_message', async (data) => {
        try {
          const { chatId, content } = data;
          const userId = socket.data.user.id;

          const sendMessage = new SendMessage(new ChatRepository());
          const message = await sendMessage.execute(chatId, userId, content);
        } catch (error) {
          console.error('Error sending message:', error);
          socket.emit('error', { message: 'Failed to send message' });
        }
      });

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.data.user.id);
        this.userSockets.delete(socket.data.user.id);
      });
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
    this.io.to(chatId).emit(event, data);
  }
}