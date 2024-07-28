import ChatRepository from '../repositories/ChatRepository';
import { Message } from '../../domain/entities/Message';
import SocketService from '../../infra/services/SocketService';

export default class MarkMessageAsRead {
  private chatRepository: ChatRepository;

  constructor(chatRepository: ChatRepository) {
    this.chatRepository = chatRepository;
  }

  public async execute(chatId: string, messageId: string, userId: string): Promise<Message> {
    const chat = await this.chatRepository.getChatById(chatId);

    if (!chat) {
      throw new Error('Chat not found');
    }

    if (!chat.participants.includes(userId)) {
      throw new Error('User is not a participant of this chat');
    }

    const message = await this.chatRepository.getMessageById(chatId, messageId);

    // console.log("message0 : ", message);
    if (!message) {
      throw new Error('Message not found');
    }
    // console.log("message1");
    if (message.senderId === userId) {
      throw new Error('Sender cannot mark their own message as read');
    }


    // console.log("message2");
    if (message.readBy.some((receipt) => receipt.userId === userId)) {
      return message; // Message is already marked as read by this user
    }
    // console.log("message3 : ", message.readBy.some((receipt) => receipt.userId === userId));

    message.readBy.push({ userId, readAt: new Date() });
    // console.log("message4 : ");
    const updatedMessage = await this.chatRepository.updateMessage(chatId, message);
    console.log("updatedMessage : ", updatedMessage);
    // console.log("message5 : ");

    SocketService.getInstance().emitToChat(chatId, 'message_read', { chatId, messageId, userId, readBy: updatedMessage.readBy });

    return updatedMessage;
  }
}
