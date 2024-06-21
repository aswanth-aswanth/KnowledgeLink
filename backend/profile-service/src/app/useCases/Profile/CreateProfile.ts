import UserRepository from '../../repositories/UserRepository';
import { IUser } from '../../../infra/databases/mongoose/models/User';

export default class CreateProfile {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    public async execute(userData: IUser): Promise<IUser> {

        const newUser = await this.userRepository.create(userData);

        return newUser;
    }
}
