import UserRepository from '../../repositories/UserRepository';
import { IUser } from '../../../infra/databases/mongoose/models/User';

export default class GetUsers {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    public async execute(currentUserId: string | null): Promise<IUser[] | object | null> {
        const users = await this.userRepository.getUsers();
        if (currentUserId) {
            return users.filter(user => user._id.toString() !== currentUserId);
        }
        return users;
    }
}
