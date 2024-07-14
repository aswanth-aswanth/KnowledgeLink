import UserRepository from '../../repositories/UserRepository';
import { IUser } from '../../../infra/databases/mongoose/models/User';

export default class SubscribeToRoadmap {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    public async execute(userId: string, roadmapId: string): Promise<IUser | object | null> {
        await this.userRepository.subscribe(userId, roadmapId);
        return { message: "Subscribed to roadmap" };
    }
}
