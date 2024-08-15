import { Request, Response } from "express";

export default class LogoutUserController {
    public async handle(req: Request, res: Response): Promise<Response> {
        try {
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });

            return res.status(200).json({ message: "Logged out successfully" });
        } catch (err) {
            console.error("Logout error:", err);
            return res.status(500).json({ error: "An error occurred during logout" });
        }
    }
}