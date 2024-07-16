import ChatRepository from '../repositories/ChatRepository';
import SocketService from '../../infra/services/SocketService';

export default class DeleteChat {
  private chatRepository: ChatRepository;
  private socketService: SocketService;

  constructor(chatRepository: ChatRepository, socketService: SocketService) {
    this.chatRepository = chatRepository;
    this.socketService = socketService;
  }

  public async execute(chatId: string, currentUserId: string): Promise<void> {
    const chat = await this.chatRepository.getChatById(chatId);

    if (!chat) {
      throw new Error('Chat not found');
    }

    if (chat.type === 'group' && !chat.participants.includes(currentUserId)) {
      throw new Error('You are not a participant of this chat');
    }

    if (chat.type === 'individual' && !chat.participants.includes(currentUserId)) {
      throw new Error('You are not a participant of this chat');
    }

    await this.chatRepository.deleteChat(chatId);

    // Notify all participants about the chat deletion
    chat.participants.forEach(userId => {
      this.socketService.emitToUser(userId, 'chat_deleted', { chatId });
    });
  }
}