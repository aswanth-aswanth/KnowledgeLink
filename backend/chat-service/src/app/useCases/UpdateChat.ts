import ChatRepository from '../repositories/ChatRepository';
import { Chat } from '../../domain/entities/Chat';
import SocketService from '../../infra/services/SocketService';

interface UpdateChatData {
  name?: string;
}

export default class UpdateChat {
  private chatRepository: ChatRepository;
  private socketService: SocketService;

  constructor(chatRepository: ChatRepository, socketService: SocketService) {
    this.chatRepository = chatRepository;
    this.socketService = socketService;
  }

  public async execute(chatId: string, updateData: UpdateChatData, currentUserId: string): Promise<Chat> {
    const chat = await this.chatRepository.getChatById(chatId);
    
    if (!chat) {
      throw new Error('Chat not found');
    }

    if (chat.type !== 'group') {
      throw new Error('This operation is only allowed for group chats');
    }

    if (!chat.participants.includes(currentUserId)) {
      throw new Error('You are not a participant of this chat');
    }

    const updatedChat = await this.chatRepository.updateChat(chatId, updateData);
    
    // Notify all participants about the chat update
    updatedChat.participants.forEach(userId => {
      this.socketService.emitToUser(userId, 'chat_updated', updatedChat);
    });

    return updatedChat;
  }
}