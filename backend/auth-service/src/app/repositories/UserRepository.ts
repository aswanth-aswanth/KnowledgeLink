import User, { IUser } from '../../infra/databases/mongoose/models/User';

export default class UserRepository {
  public async create(user: Partial<IUser>): Promise<IUser> {
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

  public async findByGoogleId(googleId: string): Promise<IUser | null> {
    try {
      return await User.findOne({ googleId });
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error finding user by Google ID: ${error.message}`);
        throw new Error('Failed to find user by Google ID');
      } else {
        console.error('Unknown error finding user by Google ID');
        throw new Error('Unknown error');
      }
    }
  }

  public async findById(id: string): Promise<IUser | null> {
    try {
      return await User.findById(id);
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
}
