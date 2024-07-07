import UserRepository from '../../repositories/UserRepository';
import { IUser } from '../../../infra/databases/mongoose/models/User';

export default class GetSearchUsers {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    public async execute(name: string, limit: number): Promise<IUser | object | null> {
        return await this.userRepository.getSearchUsers(name, limit);
    }
}