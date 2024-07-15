import ChatRepository from '../repositories/ChatRepository';
import { Message } from '../../domain/entities/Message';
import SocketService from '../../infra/services/SocketService';

export default class SendMessage {
  private chatRepository: ChatRepository;

  constructor(chatRepository: ChatRepository) {
    this.chatRepository = chatRepository;
  }

  public async execute(chatId: string, userId: string, content: string): Promise<Message> {
    const chat = await this.chatRepository.getChatById(chatId);
    
    if (!chat) {
      throw new Error('Chat not found');
    }

    if (!chat.participants.includes(userId)) {
      throw new Error('User is not a participant of this chat');
    }

    const message = new Message('', chatId, userId, content, new Date());
    const savedMessage = await this.chatRepository.addMessage(chatId, message);

    // Emit the new message to all participants
    SocketService.emitToChat(chatId, 'new_message', savedMessage);

    return savedMessage;
  }
}