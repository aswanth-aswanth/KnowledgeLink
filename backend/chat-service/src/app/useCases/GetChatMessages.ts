import ChatRepository from '../repositories/ChatRepository';
import { Message } from '../../domain/entities/Message';

export default class GetChatMessages {
  private chatRepository: ChatRepository;

  constructor(chatRepository: ChatRepository) {
    this.chatRepository = chatRepository;
  }

  public async execute(chatId: string, userId: string): Promise<Message[]> {
    const chat = await this.chatRepository.getChatById(chatId);

    if (!chat) {
      throw new Error('Chat not found');
    }

    if (!chat.participants.includes(userId)) {
      throw new Error('Unauthorized access to chat');
    }

    return chat.messages.map(message => ({
      ...message,
      isOwn: message.senderId === userId,
    }));
  }
}
