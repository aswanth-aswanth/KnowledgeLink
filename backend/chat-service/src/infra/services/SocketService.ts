import SocketIOService from './SocketIOService';

export default class SocketService {
  private static socketIOService: SocketIOService;

  public static initialize(socketIOService: SocketIOService) {
    SocketService.socketIOService = socketIOService;
  }

  public static emitToUser(userId: string, event: string, data: any) {
    SocketService.socketIOService.emitToUser(userId, event, data);
  }

  public static emitToChat(chatId: string, event: string, data: any) {
    SocketService.socketIOService.emitToChat(chatId, event, data);
  }
}