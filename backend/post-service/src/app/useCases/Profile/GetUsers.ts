import UserRepository from '../../repositories/UserRepository';
import { IUser } from '../../../infra/databases/mongoose/models/User';

export default class GetUsers {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    public async execute(): Promise<IUser | object | null> {
        return await this.userRepository.getUsers();
    }
}
