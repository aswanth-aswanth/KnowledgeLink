import UserRepository from '../../../repositories/UserRepository';
import PasswordHasher from '../../../providers/PasswordHasher';
import Publisher from '../../../../infra/messaging/rabbitmq/Publisher';
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
      throw new Error('User already exists');
    }
    const newUser = await this.userRepository.create({ email, password: hashedPassword, username } as IUser);

    // Publish user details to RabbitMQ
    const publisher = await Publisher.getInstance();
    await publisher.publish('user.registration', JSON.stringify({ email, username, password: hashedPassword }));

    return newUser;
  }
}
