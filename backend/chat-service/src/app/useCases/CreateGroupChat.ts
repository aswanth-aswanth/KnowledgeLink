import ChatRepository from '../repositories/ChatRepository';
import { Chat } from '../../domain/entities/Chat';
import SocketService from '../../infra/services/SocketService';

export default class CreateGroupChat {
  private chatRepository: ChatRepository;
  private socketService: SocketService;

  constructor(chatRepository: ChatRepository, socketService: SocketService) {
    this.chatRepository = chatRepository;
    this.socketService = socketService;
  }

  public async execute(name: string, participantIds: string[]): Promise<Chat> {
    if (participantIds.length < 3) {
      throw new Error('A group chat must have at least 3 participants');
    }
    const chat = await this.chatRepository.createGroupChat(name, participantIds);

    participantIds.forEach(userId => {
      this.socketService.emitToUser(userId, 'new_chat', chat);
    });

    return chat;
  }
}