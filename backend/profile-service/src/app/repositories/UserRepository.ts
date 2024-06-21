
import User, { IUser } from '../../infra/databases/mongoose/models/User';

export default class UserRepository {
    public async create(user: IUser): Promise<IUser> {
        const newUser = new User(user);
        return newUser.save();
    }
    public async findByEmail(email: string): Promise<IUser | null> {
        return User.findOne({ email });
    }
    public async findById(userId: string): Promise<IUser | null> {
        return User.findById(userId);
    }
    public async subscribe(userId: string, roadmapId: string): Promise<IUser | null> {
        const user = await User.findById(userId);
        if (!user) {
            return null;
        }
        user.subscribed?.push(roadmapId) || (user.subscribed = [roadmapId]);
        await user.save();
        return user;
    }
    public async getSubscribedRoadmaps(userId: string): Promise<string[]> {
        const user = await User.findById(userId);
        if (!user || !user.subscribed) {
            return [];
        }
        return user.subscribed;
    }
    public async findUsersById(userIds: string[]): Promise<object[]> {
        const users = await User.find({
            _id: { $in: userIds }
        }).select('_id username email').exec();

        return users;
    }
}