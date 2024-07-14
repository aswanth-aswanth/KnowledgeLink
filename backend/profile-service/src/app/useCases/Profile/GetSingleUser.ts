import UserRepository from '../../repositories/UserRepository';
import { IUser } from '../../../infra/databases/mongoose/models/User';

export default class GetSingleUser {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    public async execute(userId: string, loggedInUserId: string | null): Promise<IUser | object | null> {
        return await this.userRepository.getUser(userId, loggedInUserId);
    }
}