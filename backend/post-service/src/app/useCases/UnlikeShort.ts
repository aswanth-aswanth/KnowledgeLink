// src/app/useCases/UnlikeShort.ts

import ShortRepository from '../repositories/ShortRepository';
import UserRepository from '../repositories/UserRepository';

export default class UnlikeShort {
    private shortRepository: ShortRepository;
    private userRepository: UserRepository;

    constructor(shortRepository: ShortRepository, userRepository: UserRepository) {
        this.shortRepository = shortRepository;
        this.userRepository = userRepository;
    }

    public async execute(shortId: string, userId: string): Promise<void> {
        await this.shortRepository.removeLike(shortId, userId);
        await this.userRepository.removeLikedShort(userId, shortId);
    }
}