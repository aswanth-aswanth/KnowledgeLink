import ChatRepository from '../repositories/ChatRepository';
import { Chat } from '../../domain/entities/Chat';

export default class GetUserChats {
    private chatRepository: ChatRepository;

    constructor(chatRepository: ChatRepository) {
        this.chatRepository = chatRepository;
    }

    public async execute(userId: string): Promise<Chat[]> {
        return await this.chatRepository.getUserChats(userId);
    }
}