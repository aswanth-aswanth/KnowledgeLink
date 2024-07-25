import { Types } from 'mongoose';
import UserInteractionRepository from '../../repositories/UserInteractionRepository';
import { UserInteraction } from '../../../domain/entities/UserInteraction';

export default class LogUserInteraction {
    private userInteractionRepository: UserInteractionRepository;

    constructor(userInteractionRepository: UserInteractionRepository) {
        this.userInteractionRepository = userInteractionRepository;
    }

    public async execute(
        userId: string,
        roadmapId: string,
        topicId: string,
        interactionType: 'view' | 'like' | 'comment'
    ): Promise<UserInteraction> {
        const userInteraction: UserInteraction = {
            userId: new Types.ObjectId(userId),
            roadmapId: new Types.ObjectId(roadmapId),
            topicId: new Types.ObjectId(topicId),
            interactionType,
            timestamp: new Date()
        };

        return await this.userInteractionRepository.create(userInteraction);
    }
}