import { Server as SocketIOServer } from 'socket.io';
import socketAuthMiddleware from '../http/middleware/socketAuthMiddleware';
import SendMessage from '../../app/useCases/SendMessage';
import ChatRepository from '../../app/repositories/ChatRepository';

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
    this.io.on('connection', (socket) => {
      console.log('New client connected');
      console.log('Socket ID:', socket.id);
      console.log('User data:', socket.data);
      console.log('User connected:', socket.data.user.userId);
      this.userSockets.set(socket.data.user.userId, socket.id);

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
        this.userSockets.delete(socket.data.user.id);
      });
      this.io.on('connect_error', (error) => {
        console.error('Connection error:', error);
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

export default SocketService;

/* export default class SocketService {
  private static instance: SocketService;
  private io!: SocketIOServer;
  private userSockets: Map<string, string> = new Map();

  private constructor() { }

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public setIO(io: SocketIOServer) {
    this.io = io;
    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware() {
    this.io.use(socketAuthMiddleware);
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log('Connection attempt');
      console.log('Socket ID:', socket.id);
      console.log('User data:', socket.data);
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

          this.io.to(chatId).emit('new_message', message);
        } catch (error) {
          console.error('Error sending message:', error);
          socket.emit('error', { message: 'Failed to send message' });
        }
      });

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.data.user.id);
        this.userSockets.delete(socket.data.user.id);
      });
      this.io.on('connect_error', (error) => {
        console.error('Connection error:', error);
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
} */