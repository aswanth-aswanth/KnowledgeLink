import ChatRepository from '../repositories/ChatRepository';
import { Chat } from '../../domain/entities/Chat';
import SocketService from '../../infra/services/SocketService';

export default class CreateGroupChat {
  private chatRepository: ChatRepository;

  constructor(chatRepository: ChatRepository) {
    this.chatRepository = chatRepository;
  }

  public async execute(name: string, participantIds: string[]): Promise<Chat> {
    if (participantIds.length < 3) {
      throw new Error('A group chat must have at least 3 participants');
    }

    const chat = await this.chatRepository.createGroupChat(name, participantIds);
    
    // Notify all participants about the new group chat
    participantIds.forEach(userId => {
      SocketService.emitToUser(userId, 'new_chat', chat);
    });

    return chat;
  }
}