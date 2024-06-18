import UserRepository from '../../../repositories/UserRepository';
import PasswordHasher from '../../../providers/PasswordHasher';
import { IUser } from '../../../../infra/databases/mongoose/models/User';

export default class CreateUser {
  private userRepository: UserRepository;
  private passwordHasher: PasswordHasher;

  constructor(userRepository: UserRepository, passwordHasher: PasswordHasher) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
  }

  public async execute(email: string, password: string, username: string): Promise<IUser> {
    const hashedPassword = await this.passwordHasher.hash(password);
    const user = await this.userRepository.findByEmail(email);
    if (user) {
      throw new Error('User already exist');
    }
    const newUser = await this.userRepository.create({ email, password: hashedPassword, username } as IUser);
    return newUser;
  }
}
