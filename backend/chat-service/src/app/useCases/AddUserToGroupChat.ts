import ChatRepository from '../repositories/ChatRepository';
import { Chat } from '../../domain/entities/Chat';
import SocketService from '../../infra/services/SocketService';

export default class AddUserToGroupChat {
  private chatRepository: ChatRepository;
  private socketService: SocketService;

  constructor(chatRepository: ChatRepository, socketService: SocketService) {
    this.chatRepository = chatRepository;
    this.socketService = socketService;
  }

  public async execute(chatId: string, userIdToAdd: string, currentUserId: string): Promise<Chat> {
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
    if (chat.participants.includes(userIdToAdd)) {
      throw new Error('User is already a participant of this chat');
    }

    const updatedChat = await this.chatRepository.addUserToChat(chatId, userIdToAdd);
    
    // Notify all participants about the new user
    updatedChat.participants.forEach(userId => {
      this.socketService.emitToUser(userId, 'user_added_to_chat', { chatId, userId: userIdToAdd });
    });

    return updatedChat;
  }
}