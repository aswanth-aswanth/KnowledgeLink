import ChatRepository from '../repositories/ChatRepository';
import { Message, MessageWithIsOwn } from '../../domain/entities/Message';
import SocketService from '../../infra/services/SocketService';

interface MessageWithIsOwnAndSenderInfo extends MessageWithIsOwn {
  senderInfo: {
    _id: string;
    username: string;
    email: string;
    image: string;
  };
}

export default class SendMessage {
  private chatRepository: ChatRepository;

  constructor(chatRepository: ChatRepository) {
    this.chatRepository = chatRepository;
  }

  public async execute(chatId: string, userId: string, content: string): Promise<MessageWithIsOwnAndSenderInfo> {
    const chat = await this.chatRepository.getChatById(chatId);

    if (!chat) {
      throw new Error('Chat not found');
    }

    if (!chat.participants.includes(userId)) {
      throw new Error('User is not a participant of this chat');
    }

    const message = Message.create(chatId, userId, content);
    const savedMessageWithSenderInfo = await this.chatRepository.addMessageWithPopulatedSender(chatId, message);

    // Create a new object with the isOwn property for each participant
    const messageWithIsOwn = chat.participants.reduce((acc, participantId) => {
      acc[participantId] = {
        ...savedMessageWithSenderInfo,
        isOwn: participantId === userId
      };
      return acc;
    }, {} as Record<string, MessageWithIsOwnAndSenderInfo>);

    SocketService.getInstance().emitToChat(chatId, 'new_message', messageWithIsOwn);

    chat.participants.forEach(participantId => {
      console.log("participantId : ", participantId)
      if (userId != participantId) {
        SocketService.getInstance().emitToUser(participantId, 'notify', {
          ...messageWithIsOwn[participantId]
        });
      }
    });

    return {
      ...savedMessageWithSenderInfo,
      isOwn: true
    };
  }
}