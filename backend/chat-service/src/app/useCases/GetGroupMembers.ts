// src/app/useCases/GetGroupMembers.ts

import ChatRepository from '../repositories/ChatRepository';
import { IUser } from '../../infra/databases/mongoose/models/User';

export default class GetGroupMembers {
    private chatRepository: ChatRepository;

    constructor(chatRepository: ChatRepository) {
        this.chatRepository = chatRepository;
    }

    public async execute(chatId: string): Promise<IUser[]> {
        return await this.chatRepository.getGroupMembers(chatId);
    }
}
