import UserRepository from '../../repositories/UserRepository';
import { IUser } from '../../../infra/databases/mongoose/models/User';

export default class FollowUser {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    public async execute(followerEmail: string, followeeEmail: string): Promise<object> {
        return await this.userRepository.toggleFollowUser(followerEmail, followeeEmail);
    }
}