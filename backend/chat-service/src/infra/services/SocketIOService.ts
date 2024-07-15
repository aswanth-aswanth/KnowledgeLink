import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import socketAuthMiddleware from '../http/middleware/socketAuthMiddleware';
import SendMessage from '../../app/useCases/SendMessage';
import ChatRepository from '../../app/repositories/ChatRepository';

export default class SocketIOService {
  private io: Server;

  constructor(httpServer: HttpServer) {
    this.io = new Server(httpServer);
    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware() {
    this.io.use(socketAuthMiddleware);
  }
  /*  private setupMiddleware() {
     this.io.use(async (socket, next) => {
       try {
         const token = socket.handshake.auth.token;
         const user = await authMiddleware(token);
         socket.data.user = user;
         next();
       } catch (err) {
         next(new Error('Authentication error'));
       }
     });
   } */

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log('User connected:', socket.data.user.id);

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

          this.io.to(chatId).emit('new_message', message);
        } catch (error) {
          console.error('Error sending message:', error);
          socket.emit('error', { message: 'Failed to send message' });
        }
      });

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.data.user.id);
      });
    });
  }

  public emitToUser(userId: string, event: string, data: any) {
    this.io.to(userId).emit(event, data);
  }

  public emitToChat(chatId: string, event: string, data: any) {
    this.io.to(chatId).emit(event, data);
  }
}