
import { INotification } from '../../infra/databases/mongoose/models/Notification';
import NotificationRepository from '../repositories/NotificationRepository';

export default class GetNotificationCount {
    private notificationRepository: NotificationRepository;

    constructor(notificationRepository: NotificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public async execute(email: string): Promise<any> {
        return await this.notificationRepository.getUnreadNotificationCount(email);
    }
}