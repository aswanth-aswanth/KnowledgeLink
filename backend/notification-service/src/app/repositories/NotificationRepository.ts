import Notification, { INotification } from '../../infra/databases/mongoose/models/Notification';


export default class PostRepository {

    public async getNotification(email: string) {
        try {
            const notifications = await Notification.find({ recipient: email });
            return notifications;
        } catch (error) {
            console.error('Error toggling like:', error);
            throw error;
        }
    }

    public async getUnreadNotificationCount(email: string) {
        try {
            const recipientNotifications = await Notification.findOne({ recipient: email });

            if (recipientNotifications) {
                const unreadCount = recipientNotifications.notifications.filter(notification => !notification.read).length;
                return unreadCount;
            } else {
                return 0;
            }
        } catch (error) {
            console.error('Error getting unread notification count:', error);
            throw error;
        }
    }


}