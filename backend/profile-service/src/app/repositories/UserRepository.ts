
import User, { IUser } from '../../infra/databases/mongoose/models/User';

export default class UserRepository {
    public async create(user: any): Promise<IUser> {
        const newUser = new User(user);
        return newUser.save();
    }
    public async findByEmail(email: string): Promise<IUser | null> {
        return User.findOne({ email });
    }
    public async findById(userId: string): Promise<IUser | null> {
        return User.findById(userId);
    }
    public async subscribe(email: string, roadmapId: string): Promise<IUser | null> {
        const user = await User.findOne({ email });
        console.log("user subscribe : ", user);
        if (!user) {
            return null;
        }

        if (!user.subscribed) {
            user.subscribed = [];
        }

        if (!user.subscribed.includes(roadmapId)) {
            user.subscribed.push(roadmapId);
        }

        await user.save();

        return user;
    }
    public async getSubscribedRoadmaps(email: string): Promise<string[]> {
        const user = await User.findOne({ email });
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