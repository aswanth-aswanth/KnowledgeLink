import { Request, Response } from 'express';
import GetNotificationCount from '../../../app/useCases/GetNotificationCount';
import NotificationRepository from '../../../app/repositories/NotificationRepository';

export default class GetNotificationCountController {
    public async handle(req: any, res: Response) {
        try {
            const email = req.user.email;
            const getNotificationCount = new GetNotificationCount(
                new NotificationRepository()
            );
            const count = await getNotificationCount.execute(email);
            return res.status(201).json({ unReadCount: count, message: "Success" });
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ error: err.message });
            }
            return res.status(500).json({ error: 'Unknown error' });
        }
    }
};
