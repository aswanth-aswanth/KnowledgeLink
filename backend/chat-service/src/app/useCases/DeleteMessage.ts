// Create a new file: DeleteMessage.ts

import ChatRepository from '../repositories/ChatRepository';
import SocketService from '../../infra/services/SocketService';

export default class DeleteMessage {
  private chatRepository: ChatRepository;

  constructor(chatRepository: ChatRepository) {
    this.chatRepository = chatRepository;
  }

  public async execute(chatId: string, messageId: string, userId: string): Promise<void> {
    const chat = await this.chatRepository.getChatById(chatId);

    if (!chat) {
      throw new Error('Chat not found');
    }

    if (!chat.participants.includes(userId)) {
      throw new Error('User is not a participant of this chat');
    }

    const message = await this.chatRepository.getMessageById(chatId, messageId);

    if (!message) {
      throw new Error('Message not found');
    }

    if (message.senderId !== userId) {
      throw new Error('User is not authorized to delete this message');
    }

    await this.chatRepository.deleteMessage(chatId, messageId);

    SocketService.getInstance().emitToChat(chatId, 'delete_message', { chatId, messageId });
  }
}