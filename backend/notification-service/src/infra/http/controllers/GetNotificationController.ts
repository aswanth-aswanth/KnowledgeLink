import { Request, Response } from 'express';
import GetNotification from '../../../app/useCases/GetNotification';
import NotificationRepository from '../../../app/repositories/NotificationRepository';

export default class GetNotificationController {
    public async handle(req: any, res: Response) {
        try {
            const email = req.user.email;
            const getNotification = new GetNotification(
                new NotificationRepository()
            );
            const result = await getNotification.execute(email);
            return res.status(201).json({ notifications: result, message: "Success" });
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ error: err.message });
            }
            return res.status(500).json({ error: 'Unknown error' });
        }
    }
};
