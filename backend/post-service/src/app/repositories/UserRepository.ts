import User, { IUser } from '../../infra/databases/mongoose/models/User';

export default class UserRepository {

    public async create(user: any): Promise<IUser> {
        try {
            const newUser = new User(user);
            return await newUser.save();
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error creating user: ${error.message}`);
                throw new Error('Failed to create user');
            } else {
                console.error('Unknown error creating user');
                throw new Error('Unknown error');
            }
        }
    }

    public async findById(userId: string): Promise<IUser | null> {
        return await User.findById(userId);
    }

    public async addLikedShort(userId: string, shortId: string): Promise<void> {
        await User.findByIdAndUpdate(userId, { $addToSet: { likedShorts: shortId } });
    }

    public async removeLikedShort(userId: string, shortId: string): Promise<void> {
        await User.findByIdAndUpdate(userId, { $pull: { likedShorts: shortId } });
    }

    public async addViewedShort(userId: string, shortId: string): Promise<void> {
        await User.findByIdAndUpdate(userId, { $addToSet: { viewedShorts: shortId } });
    }
}