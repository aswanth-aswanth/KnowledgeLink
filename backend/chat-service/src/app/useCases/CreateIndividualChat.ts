import ChatRepository from '../repositories/ChatRepository';
import { Chat } from '../../domain/entities/Chat';
import SocketService from '../../infra/services/SocketService';

export default class CreateIndividualChat {
  private chatRepository: ChatRepository;
  private socketService: SocketService;

  constructor(chatRepository: ChatRepository, socketService: SocketService) {
    this.chatRepository = chatRepository;
    this.socketService = socketService;
  }

  public async execute(currentUserId: string, participantId: string): Promise<Chat> {
    const chat = await this.chatRepository.createIndividualChat(currentUserId, participantId);
    
    // Notify both users about the new chat
    this.socketService.emitToUser(currentUserId, 'new_chat', chat);
    this.socketService.emitToUser(participantId, 'new_chat', chat);

    return chat;
  }
}