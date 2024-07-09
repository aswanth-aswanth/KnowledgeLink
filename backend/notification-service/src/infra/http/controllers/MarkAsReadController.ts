import { Request, Response } from 'express';
import MarkAsRead from '../../../app/useCases/MarkAsRead';
import NotificationRepository from '../../../app/repositories/NotificationRepository';

export default class MarkAsReadController {
    public async handle(req: any, res: Response) {
        try {
            const email = req.user.email;
            const notificationIds = req.body.notificationIds;
            const markAsRead = new MarkAsRead(
                new NotificationRepository()
            );
            const result = await markAsRead.execute(email, notificationIds);
            return res.status(201).json({ message: "Success" });
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ error: err.message });
            }
            return res.status(500).json({ error: 'Unknown error' });
        }
    }
};
