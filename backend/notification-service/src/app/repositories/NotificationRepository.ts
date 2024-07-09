import Notification, { INotification, IRecipientNotifications } from '../../infra/databases/mongoose/models/Notification';
import { Types } from 'mongoose';


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

    public async markNotificationsAsRead(email: string, notificationIds: string[]): Promise<{ message: string }> {
        try {
            const result = await Notification.findOneAndUpdate(
                { recipient: email },
                {
                    $set: {
                        'notifications.$[elem].read': true
                    }
                },
                {
                    arrayFilters: [{ 'elem._id': { $in: notificationIds } }],
                    new: true
                }
            );

            if (!result) {
                throw new Error('User not found or no notifications updated');
            }

            const updatedCount = result.notifications.filter(n => notificationIds.includes(n._id.toString()) && n.read).length;

            return { message: `${updatedCount} notification(s) marked as read` };
        } catch (error) {
            console.error('Error marking notifications as read:', error);
            throw error;
        }
    }

    public async save(notificationData: { recipient: string, notification: Partial<INotification> }): Promise<IRecipientNotifications> {
        try {
            const { recipient, notification } = notificationData;
            const result = await Notification.findOneAndUpdate(
                { recipient },
                {
                    $push: {
                        notifications: {
                            $each: [notification],
                            $slice: -30 // Keep only the last 30 notifications
                        }
                    }
                },
                { upsert: true, new: true }
            );
            return result;
        } catch (error) {
            console.error('Error saving notification:', error);
            throw error;
        }
    }
}