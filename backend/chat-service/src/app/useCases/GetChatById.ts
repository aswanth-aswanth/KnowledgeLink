import ChatRepository from '../repositories/ChatRepository';
import { Chat } from '../../domain/entities/Chat';

export default class GetChatById {
  private chatRepository: ChatRepository;

  constructor(chatRepository: ChatRepository) {
    this.chatRepository = chatRepository;
  }

  public async execute(chatId: string, currentUserId: string): Promise<Chat> {
    const chat = await this.chatRepository.getChatById(chatId);
    
    if (!chat) {
      throw new Error('Chat not found');
    }

    if (!chat.participants.includes(currentUserId)) {
      throw new Error('Unauthorized access to chat');
    }

    return chat;
  }
}