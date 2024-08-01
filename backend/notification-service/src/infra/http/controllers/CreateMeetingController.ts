import { Request, Response } from 'express';
import CreateMeeting from '../../../app/useCases/CreateMeeting';
import MeetingRepository from '../../../app/repositories/MeetingRepository';
import NotificationRepository from '../../../app/repositories/NotificationRepository';
import SocketService from '../../services/SocketService';

export default class CreateMeetingController {
    public async handle(req: any, res: Response) {
        try {
            const { meetingId, title, description, scheduledTime, roomName, invitedUsers } = req.body;
            const createdBy = req.user.email;

            const createMeeting = new CreateMeeting(
                new MeetingRepository(),
                new NotificationRepository(),
                SocketService.getInstance()
            );

            const meeting = await createMeeting.execute({
                meetingId,
                title,
                description,
                scheduledTime,
                roomName,
                createdBy,
                invitedUsers
            });

            return res.status(201).json({ message: "Meeting created successfully", meeting });
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ error: err.message });
            }
            return res.status(500).json({ error: 'Unknown error' });
        }
    }
}