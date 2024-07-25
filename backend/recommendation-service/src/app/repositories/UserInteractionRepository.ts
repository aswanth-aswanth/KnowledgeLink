import { UserInteraction } from '../../domain/entities/UserInteraction';
import UserInteractionModel from '../../infra/databases/mongoose/models/UserInteraction';

export default class UserInteractionRepository {
    public async create(userInteraction: UserInteraction): Promise<UserInteraction> {
        try {
            const newUserInteraction = new UserInteractionModel(userInteraction);
            return await newUserInteraction.save();
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to create user interaction: ${error.message}`);
            }
            throw new Error('Unknown error creating user interaction');
        }
    }

    public async findByUserId(userId: string): Promise<UserInteraction[]> {
        try {
            return await UserInteractionModel.find({ userId }).exec();
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to find user interactions: ${error.message}`);
            }
            throw new Error('Unknown error finding user interactions');
        }
    }
}