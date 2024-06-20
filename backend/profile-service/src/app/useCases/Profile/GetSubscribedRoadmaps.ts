import UserRepository from "../../repositories/UserRepository";

export default class GetSubscribedRoadmaps {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    public async execute(userId: string): Promise<string[]> {
        try {
            const subscribedRoadmaps = await this.userRepository.getSubscribedRoadmaps(userId);
            return subscribedRoadmaps;
        } catch (error) {
            console.error('Error retrieving subscribed roadmaps:', error);
            throw new Error('Failed to retrieve subscribed roadmaps');
        }
    }
}
