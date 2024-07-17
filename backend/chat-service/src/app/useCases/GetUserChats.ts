import ChatRepository from '../repositories/ChatRepository';
// import { UserChatInfo } from '../types/UserChatInfo'; // Adjust the import path as necessary
type UserChatInfo = {
    username: string;
    userId:string;
    chatId: string;
    lastMessage: string;
    updatedAt: Date;
    image:string;
};

export default class GetUserChats {
    private chatRepository: ChatRepository;

    constructor(chatRepository: ChatRepository) {
        this.chatRepository = chatRepository;
    }

    public async execute(userId: string): Promise<UserChatInfo[]> {
        return await this.chatRepository.getUserChats(userId);
    }
}
