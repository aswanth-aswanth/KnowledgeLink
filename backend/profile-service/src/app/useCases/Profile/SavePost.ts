import UserRepository from '../../repositories/UserRepository';
import { IUser } from '../../../infra/databases/mongoose/models/User';

export default class SavePost {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    public async execute(userId: string, postId: string): Promise<IUser | object | null> {
        const user = await this.userRepository.savePost(userId, postId);
        if (!user) {
            return { message: "User not found" };
        }
        return { message: "Post saved to favourites" };
    }
}
