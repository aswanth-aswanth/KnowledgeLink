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

  public async execute(email: string, password: string): Promise<IUser> {
    const hashedPassword = await this.passwordHasher.hash(password);
    const user = await this.userRepository.create({ email, password: hashedPassword } as IUser);
    return user;
  }
}
