import ChatRepository from '../repositories/ChatRepository';
import { Message, MessageWithIsOwn } from '../../domain/entities/Message';
import SocketService from '../../infra/services/SocketService';

export default class SendMessage {
  private chatRepository: ChatRepository;

  constructor(chatRepository: ChatRepository) {
    this.chatRepository = chatRepository;
  }

  public async execute(chatId: string, userId: string, content: string): Promise<MessageWithIsOwn> {
    const chat = await this.chatRepository.getChatById(chatId);

    if (!chat) {
      throw new Error('Chat not found');
    }

    if (!chat.participants.includes(userId)) {
      throw new Error('User is not a participant of this chat');
    }

    const message = Message.create(chatId, userId, content);
    const savedMessage = await this.chatRepository.addMessage(chatId, message);

    // Create a new object with the isOwn property for each participant
    const messageWithIsOwn = chat.participants.reduce((acc, participantId) => {
      acc[participantId] = {
        ...savedMessage,
        isOwn: participantId === userId
      };
      return acc;
    }, {} as Record<string, MessageWithIsOwn>);

    SocketService.getInstance().emitToChat(chatId, 'new_message', messageWithIsOwn);

    return {
      ...savedMessage,
      isOwn: true // The sender always considers the message as their own
    };
  }
}