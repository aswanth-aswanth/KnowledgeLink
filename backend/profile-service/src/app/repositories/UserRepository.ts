
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
    public async getUsers(): Promise<object[]> {
        const users = await User.find().select('_id username email image').exec();

        return users;
    }
    public async getUser(email: string, loggedInUserEmail: string | null): Promise<IUser | object | null> {
        try {
            const user = await User.findOne({ email }).select('_id username email image following followers').exec();

            if (!user) {
                throw new Error('User not found');
            }

            let isFollowing = false;

            if (loggedInUserEmail && user.followers) {
                isFollowing = user.followers.includes(loggedInUserEmail);
            }

            return { ...user.toObject(), isFollowing };
        } catch (error) {
            console.error('Error fetching user:', error);
            return null;
        }
    }
    public async toggleFollowUser(followerEmail: string, followeeEmail: string): Promise<object> {
        const follower = await User.findOne({ email: followerEmail });
        const followee = await User.findOne({ email: followeeEmail });

        if (!follower || !followee) {
            throw new Error('User not found');
        }

        const isFollowing = follower.following?.includes(followee.email);

        if (isFollowing) {
            // Unfollow
            follower.following = follower.following?.filter(email => email !== followee.email);
            followee.followers = followee.followers?.filter(email => email !== follower.email);
            await follower.save();
            await followee.save();
            return { message: 'User unfollowed successfully', action: 'unfollow' };
        } else {
            // Follow
            follower.following?.push(followee.email);
            followee.followers?.push(follower.email);
            await follower.save();
            await followee.save();
            return { message: 'User followed successfully', action: 'follow' };
        }
    }

}