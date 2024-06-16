import UserRepository from '../../../repositories/UserRepository';
import PasswordHasher from '../../../providers/PasswordHasher';
import TokenManager from '../../../providers/TokenManager';

export default class AuthenticateUser {
    private userRepository: UserRepository;
    private passwordHasher: PasswordHasher;
    private tokenManager: TokenManager;
    constructor(userRepository: UserRepository, passwordHasher: PasswordHasher, tokenManager: TokenManager) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
        this.tokenManager = tokenManager;
    }

    public async execute(email: string, password: string): Promise<String> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isPasswordValid = await this.passwordHasher.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid credentials");
        }
        return this.tokenManager.generateToken(user.id);
    }
}