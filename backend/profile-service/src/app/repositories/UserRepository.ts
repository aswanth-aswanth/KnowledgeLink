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

    public async findByEmail(email: string): Promise<IUser | null> {
        try {
            return await User.findOne({ email });
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error finding user by email: ${error.message}`);
                throw new Error('Failed to find user by email');
            } else {
                console.error('Unknown error finding user by email');
                throw new Error('Unknown error');
            }
        }
    }

    public async findById(userId: string): Promise<IUser | null> {
        try {
            return await User.findById(userId);
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error finding user by ID: ${error.message}`);
                throw new Error('Failed to find user by ID');
            } else {
                console.error('Unknown error finding user by ID');
                throw new Error('Unknown error');
            }
        }
    }

    public async subscribe(userId: string, roadmapId: string): Promise<IUser | null> {
        try {
            const user = await User.findById(userId);
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
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error subscribing user: ${error.message}`);
                throw new Error('Failed to subscribe user');
            } else {
                console.error('Unknown error subscribing user');
                throw new Error('Unknown error');
            }
        }
    }

    public async getSubscribedRoadmaps(userId: string): Promise<string[]> {
        try {
            const user = await User.findOne({ _id: userId });
            if (!user || !user.subscribed) {
                return [];
            }
            return user.subscribed;
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error getting subscribed roadmaps: ${error.message}`);
                throw new Error('Failed to get subscribed roadmaps');
            } else {
                console.error('Unknown error getting subscribed roadmaps');
                throw new Error('Unknown error');
            }
        }
    }

    public async findUsersById(userIds: string[]): Promise<object[]> {
        try {
            const users = await User.find({
                _id: { $in: userIds }
            }).select('_id username email').exec();

            return users;
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error finding users by ID: ${error.message}`);
                throw new Error('Failed to find users by ID');
            } else {
                console.error('Unknown error finding users by ID');
                throw new Error('Unknown error');
            }
        }
    }

    public async getUsers(): Promise<object[]> {
        try {
            const users = await User.find().select('_id username email image').exec();
            return users;
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error getting users: ${error.message}`);
                throw new Error('Failed to get users');
            } else {
                console.error('Unknown error getting users');
                throw new Error('Unknown error');
            }
        }
    }

    public async getUser(email: string, loggedInUserId: string | null): Promise<IUser | object | null> {
        try {
            const user = await User.findOne({ email }).select('_id username email image following followers').exec();

            if (!user) {
                throw new Error('User not found');
            }

            let isFollowing = false;

            if (loggedInUserId && user.followers) {
                isFollowing = user.followers.includes(loggedInUserId);
            }

            return { ...user.toObject(), isFollowing };
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error fetching user: ${error.message}`);
                throw new Error('Failed to fetch user');
            } else {
                console.error('Unknown error fetching user');
                throw new Error('Unknown error');
            }
        }
    }

    public async toggleFollowUser(followerEmail: string, followeeEmail: string): Promise<object> {
        try {
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
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error toggling follow user: ${error.message}`);
                throw new Error('Failed to toggle follow user');
            } else {
                console.error('Unknown error toggling follow user');
                throw new Error('Unknown error');
            }
        }
    }

    public async getSearchUsers(searchText: string, limit: number = 10): Promise<object[]> {
        try {
            const regex = new RegExp(searchText, 'i');

            const users = await User.find({
                $or: [
                    { email: { $regex: regex } },
                    { username: { $regex: regex } }
                ]
            })
                .select('_id username email image')
                .limit(limit)
                .exec();

            return users.map(user => user.toObject());
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error searching users: ${error.message}`);
                throw new Error('Failed to search users');
            } else {
                console.error('Unknown error searching users');
                throw new Error('Unknown error');
            }
        }
    }
}
