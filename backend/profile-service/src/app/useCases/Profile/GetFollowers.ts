import UserRepository from '../../repositories/UserRepository';

export default class GetFollowers {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    public async execute(userId: string): Promise<{ username: string, image: string, email: string, _id: string }[]> {
        return await this.userRepository.getFollowers(userId);
    }
}
