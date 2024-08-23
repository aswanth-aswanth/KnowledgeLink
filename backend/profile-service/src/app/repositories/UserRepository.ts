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

    public async getPaginatedUsers(page: number, limit: number): Promise<{ users: object[], totalCount: number }> {
        try {
            const skip = (page - 1) * limit;

            const [users, totalCount] = await Promise.all([
                User.find()
                    .select('_id username email image role status')
                    .skip(skip)
                    .limit(limit)
                    .exec(),
                User.countDocuments()
            ]);

            return { users, totalCount };
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error getting paginated users: ${error.message}`);
                throw new Error('Failed to get paginated users');
            } else {
                console.error('Unknown error getting paginated users');
                throw new Error('Unknown error');
            }
        }
    }

    public async savePost(userId: string, postId: string): Promise<IUser | null> {
        try {
            const user = await User.findById(userId);
            if (!user) {
                return null;
            }

            if (!user.favourites) {
                user.favourites = [];
            }

            if (!user.favourites.includes(postId)) {
                user.favourites.push(postId);
            }

            await user.save();

            return user;
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error saving post: ${error.message}`);
                throw new Error('Failed to save post');
            } else {
                console.error('Unknown error saving post');
                throw new Error('Unknown error');
            }
        }
    }

    public async getFollowers(userId: string): Promise<{ username: string, image: string, email: string, _id: string }[]> {
        try {
            const user = await User.findById(userId).select('followers').exec();
            if (!user || !user.followers || user.followers.length === 0) {
                return [];
            }

            const followers = await User.find({
                _id: { $in: user.followers }
            }).select('_id username email image').exec();

            return followers.map(follower => ({
                _id: follower._id.toString(),
                username: follower.username || "",
                email: follower.email || "",
                image: follower.image || "",
            }));
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error getting followers: ${error.message}`);
                throw new Error('Failed to get followers');
            } else {
                console.error('Unknown error getting followers');
                throw new Error('Unknown error');
            }
        }
    }

    public async getFollowings(userId: string): Promise<{ username: string, image: string, email: string, _id: string }[]> {
        try {
            const user = await User.findById(userId).select('following').exec();
            if (!user || !user.following || user.following.length === 0) {
                return [];
            }

            const following = await User.find({
                _id: { $in: user.following }
            }).select('_id username email image').exec();

            return following.map(following => ({
                _id: following._id.toString(),
                username: following.username || "",
                email: following.email || "",
                image: following.image || "",
            }));
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error getting followers: ${error.message}`);
                throw new Error('Failed to get followers');
            } else {
                console.error('Unknown error getting followers');
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

    public async unsubscribe(userId: string, roadmapId: string): Promise<IUser | null> {
        try {
            const user = await User.findById(userId);
            console.log("user unsubscribe : ", user);
            if (!user) {
                return null;
            }

            if (!user.subscribed) {
                user.subscribed = [];
            }

            const index = user.subscribed.indexOf(roadmapId);
            if (index !== -1) {
                user.subscribed.splice(index, 1);
            }

            await user.save();

            return user;
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error unsubscribing user: ${error.message}`);
                throw new Error('Failed to unsubscribe user');
            } else {
                console.error('Unknown error unsubscribing user');
                throw new Error('Unknown error');
            }
        }
    }

    public async getSavedPosts(userId: string): Promise<any> {
        const user = await User.findById(userId).select('favourites');
        return user ? user.favourites : [];
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

    public async getUsers(): Promise<IUser[]> {
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
