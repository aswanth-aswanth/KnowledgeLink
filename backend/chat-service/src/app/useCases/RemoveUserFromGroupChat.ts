import ChatRepository from '../repositories/ChatRepository';
import { Chat } from '../../domain/entities/Chat';
import SocketService from '../../infra/services/SocketService';

export default class RemoveUserFromGroupChat {
    private chatRepository: ChatRepository;
    private socketService: SocketService;

    constructor(chatRepository: ChatRepository, socketService: SocketService) {
        this.chatRepository = chatRepository;
        this.socketService = socketService;
    }

    public async execute(chatId: string, userIdToRemove: string, currentUserId: string): Promise<Chat> {
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
        if (!chat.participants.includes(userIdToRemove)) {
            throw new Error('User is not a participant of this chat');
        }

        const updatedChat = await this.chatRepository.removeUserFromChat(chatId, userIdToRemove);

        // Notify all participants about the removed user
        updatedChat.participants.forEach(userId => {
            this.socketService.emitToUser(userId, 'user_removed_from_chat', { chatId, userId: userIdToRemove });
        });

        // Notify the removed user
        this.socketService.emitToUser(userIdToRemove, 'removed_from_chat', { chatId });

        return updatedChat;
    }
}