import ShortRepository from '../repositories/ShortRepository';
import UserRepository from '../repositories/UserRepository';

export default class ViewShort {
    private shortRepository: ShortRepository;
    private userRepository: UserRepository;

    constructor(shortRepository: ShortRepository, userRepository: UserRepository) {
        this.shortRepository = shortRepository;
        this.userRepository = userRepository;
    }

    public async execute(shortId: string, userId: string): Promise<void> {
        await this.shortRepository.incrementViews(shortId);
        await this.userRepository.addViewedShort(userId, shortId);
    }
}