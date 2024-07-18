import ChatRepository from '../repositories/ChatRepository';

interface GroupChatInfo {
    chatId: string;
    name: string;
    lastMessage: string;
    updatedAt: Date;
}

export default class GetUserGroupChats {
    private chatRepository: ChatRepository;

    constructor(chatRepository: ChatRepository) {
        this.chatRepository = chatRepository;
    }

    public async execute(userId: string): Promise<GroupChatInfo[]> {
        return this.chatRepository.getUserGroupChats(userId);
    }
}