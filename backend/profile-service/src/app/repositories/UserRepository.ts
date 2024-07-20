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

    public async getUser(userId: string, loggedInUserId: string | null): Promise<object | null> {
        try {
            const user = await User.findById(userId).select('_id username email image following followers').exec();

            if (!user) {
                throw new Error('User not found');
            }

            let isFollowing = false;

            if (loggedInUserId && user.followers) {
                isFollowing = user.followers.includes(loggedInUserId);
            }

            const followingCount = user.following ? user.following.length : 0;
            const followersCount = user.followers ? user.followers.length : 0;

            return {
                _id: user._id,
                username: user.username,
                email: user.email,
                image: user.image,
                followingCount,
                followersCount,
                isFollowing
            };
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

    public async updateProfile(userId: string, data: { name?: string; bio?: string; image?: string; }): Promise<IUser | null> {
        try {
            const user = await User.findById(userId);
            if (!user) {
                return null;
            }

            if (data.name) {
                user.username = data.name;
            }
            if (data.bio) {
                user.bio = data.bio;
            }
            if (data.image) {
                user.image = data.image;
            }

            await user.save();
            return user;
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error updating user profile: ${error.message}`);
                throw new Error('Failed to update user profile');
            } else {
                console.error('Unknown error updating user profile');
                throw new Error('Unknown error');
            }
        }
    }

    public async toggleFollowUser(followerUserId: string, followeeUserId: string): Promise<object> {
        try {
            const follower = await User.findById(followerUserId);
            const followee = await User.findById(followeeUserId);

            if (!follower || !followee) {
                throw new Error('User not found');
            }

            const isFollowing = follower.following?.includes(followee._id);
            console.log("isFollowing : ", isFollowing);

            if (isFollowing) {

                follower.following = follower.following?.filter(id => id !== followee._id);
                console.log('follower.following : ', follower.following);
                followee.followers = followee.followers?.filter(id => id !== follower._id);
                console.log('followee.following : ', followee.following);
                await follower.save();
                await followee.save();
                return { message: 'User unfollowed successfully', action: 'unfollow' };
            } else {
                // Follow
                follower.following?.push(followee._id);
                followee.followers?.push(follower._id);
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

    public async save(user: IUser): Promise<IUser> {
        try {
            return user.save();

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
