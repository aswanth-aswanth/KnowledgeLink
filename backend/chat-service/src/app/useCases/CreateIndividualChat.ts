import ChatRepository from '../repositories/ChatRepository';
import { Chat } from '../../domain/entities/Chat';
import SocketService from '../../infra/services/SocketService';

export default class CreateIndividualChat {
  private chatRepository: ChatRepository;

  constructor(chatRepository: ChatRepository) {
    this.chatRepository = chatRepository;
  }

  public async execute(currentUserId: string, participantId: string): Promise<Chat> {
    const chat = await this.chatRepository.createIndividualChat(currentUserId, participantId);
    
    // Notify both users about the new chat
    SocketService.emitToUser(currentUserId, 'new_chat', chat);
    SocketService.emitToUser(participantId, 'new_chat', chat);

    return chat;
  }
}