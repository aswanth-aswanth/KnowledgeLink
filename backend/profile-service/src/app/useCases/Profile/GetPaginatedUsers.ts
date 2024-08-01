import UserRepository from '../../repositories/UserRepository';

export default class GetPaginatedUsers {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    public async execute(page: number, limit: number) {
        return await this.userRepository.getPaginatedUsers(page, limit);
    }
}