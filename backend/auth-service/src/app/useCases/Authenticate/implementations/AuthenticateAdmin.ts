import TokenManager from '../../../providers/TokenManager';

export default class AuthenticateAdmin {
    private tokenManager: TokenManager;

    constructor(tokenManager: TokenManager) {
        this.tokenManager = tokenManager;
    }

    public async execute(email: string, password: string): Promise<string> {
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            return this.tokenManager.generateToken({ userId: "adminUserId", username: "admin", email: "admin@123.com", image: "", role: "admin" });
        } else {
            throw new Error('Invalid credentials');
        }
    }
}
