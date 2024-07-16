import User, { IUser } from '../../infra/databases/mongoose/models/User';

export default class UserRepository {
    public async create(user: any): Promise<IUser> {
        try {
            const newUser = new User({ username: user.username, email: user.email, image: user.image, _id: user._id });
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
