import User, { IUser } from '../../infra/databases/mongoose/models/User';

export default class UserRepository {
  public async create(user: Partial<IUser>): Promise<IUser> {
    const newUser = new User(user);
    return newUser.save();
  }

  public async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email });
  }

  public async findByGoogleId(googleId: string): Promise<IUser | null> {
    return User.findOne({ googleId });
  }

  public async findById(id: string): Promise<IUser | null> {
    return User.findById(id);
  }
}
