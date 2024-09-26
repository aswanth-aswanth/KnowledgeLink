import { Server as SocketIOServer, Socket } from 'socket.io';
import socketAuthMiddleware from '../http/middleware/socketAuthMiddleware';
import SendMessage from '../../app/useCases/SendMessage';
import ChatRepository from '../../app/repositories/ChatRepository';
import MarkMessageAsRead from '../../app/useCases/MarkMessageAsRead';

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

      socket.on('leave_room', (chatId: string) => {
        console.log(`User ${socket.data.user.userId} leaving room ${chatId}`);
        socket.leave(chatId);
      });

      socket.on('send_message', async (data) => {
        try {
          const { chatId, content } = data;
          const userId = socket.data.user.userId;

          const sendMessage = new SendMessage(new ChatRepository());
          const message = await sendMessage.execute(chatId, userId, content);

        } catch (error) {
          console.error('Error sending message:', error);
          socket.emit('error', { message: 'Failed to send message' });
        }
      });

      socket.on('message_read', async ({ chatId, messageId }: { chatId: string, messageId: string }) => {
        try {
          const markMessageAsRead = new MarkMessageAsRead(new ChatRepository());
          const updatedMessage = await markMessageAsRead.execute(chatId, messageId, socket.data.user.userId);

        } catch (error) {
          console.error('Error updating message read status:', error);
        }
      });


      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.data.user.id);
        this.userSockets.delete(socket.data.user.id);
      });
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