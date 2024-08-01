import ChatRepository from '../repositories/ChatRepository';
import { IChatDocument } from '../../infra/databases/mongoose/models/Chat';

export default class GetAllGroupChats {
    private chatRepository: ChatRepository;

    constructor(chatRepository: ChatRepository) {
        this.chatRepository = chatRepository;
    }

    public async execute(): Promise<IChatDocument[]> {
        return await this.chatRepository.getAllGroupChats();
    }
}
