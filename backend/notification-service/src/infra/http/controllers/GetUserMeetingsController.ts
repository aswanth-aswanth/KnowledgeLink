import { Request, Response } from 'express';
import GetUserMeetings from '../../../app/useCases/GetUserMeetings';
import MeetingRepository from '../../../app/repositories/MeetingRepository';

export default class GetUserMeetingsController {
    public async handle(req: any, res: Response) {
        try {
            const userEmail = req.user.email;

            const getUserMeetings = new GetUserMeetings(
                new MeetingRepository()
            );

            const meetings = await getUserMeetings.execute(userEmail);

            return res.status(200).json(meetings);
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ error: err.message });
            }
            return res.status(500).json({ error: 'Unknown error' });
        }
    }
}