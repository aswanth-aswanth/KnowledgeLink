import MeetingRepository from '../repositories/MeetingRepository';
import NotificationRepository from '../repositories/NotificationRepository';
import SocketService from '../../infra/services/SocketService';

export default class CreateMeeting {
    private meetingRepository: MeetingRepository;
    private notificationRepository: NotificationRepository;
    private socketService: SocketService;

    constructor(
        meetingRepository: MeetingRepository,
        notificationRepository: NotificationRepository,
        socketService: SocketService
    ) {
        this.meetingRepository = meetingRepository;
        this.notificationRepository = notificationRepository;
        this.socketService = socketService;
    }

    public async execute(meetingData: any): Promise<any> {
        const meeting = await this.meetingRepository.save(meetingData);

        for (const userEmail of meetingData.invitedUsers) {
            const notificationData = {
                recipient: userEmail,
                notification: {
                    type: 'meeting_invitation',
                    content: `You've been invited to a meeting: ${meeting.title}`
                }
            };

            await this.notificationRepository.save(notificationData);
            this.socketService.sendNotification(userEmail, notificationData.notification);
        }

        return meeting;
    }
}