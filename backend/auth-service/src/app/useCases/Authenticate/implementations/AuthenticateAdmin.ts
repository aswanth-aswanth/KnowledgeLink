import TokenManager from '../../../providers/TokenManager';

export default class AuthenticateAdmin {
    private tokenManager: TokenManager;

    constructor(tokenManager: TokenManager) {
        this.tokenManager = tokenManager;
    }

    public async execute(email: string, password: string): Promise<{ token: string, refreshToken: string }> {
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = this.tokenManager.generateAccessToken({ userId: "adminUserId", username: "admin", email: "admin@123.com", image: "", role: "admin" });
            const refreshToken = this.tokenManager.generateRefreshToken("adminUserId");
            return { token, refreshToken };
        } else {
            throw new Error('Invalid credentials');
        }
    }
}
