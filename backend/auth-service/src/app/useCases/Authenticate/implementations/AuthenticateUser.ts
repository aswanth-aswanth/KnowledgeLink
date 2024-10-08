// AuthenticateUser.ts
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

    public async execute(email: string, password: string): Promise<{ token: string, refreshToken: string }> {
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new Error('Invalid credentials');
        }

        if (!user.password) {
            throw new Error('Password not set. Please log in using Google.');
        }

        const isPasswordValid = await this.passwordHasher.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid credentials");
        }

        const token = this.tokenManager.generateAccessToken({ userId: user._id, username: user.username, email: user.email, image: user.image, role: "user" });
        const refreshToken = this.tokenManager.generateRefreshToken(user._id);

        return { token, refreshToken };
    }
}