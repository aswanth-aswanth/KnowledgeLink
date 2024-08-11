import UserRepository from '../../repositories/UserRepository';
import { IUser } from '../../../infra/databases/mongoose/models/User';

export default class UnSubscribeToRoadmap {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    public async execute(userId: string, roadmapId: string): Promise<IUser | object | null> {
        await this.userRepository.unsubscribe(userId, roadmapId);
        return { message: "Roadmap unsubscribed" };
    }
}
