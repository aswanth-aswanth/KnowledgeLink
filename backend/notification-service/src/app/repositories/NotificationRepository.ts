import Notification, { INotification } from '../../infra/databases/mongoose/models/Notification';
import mongoose from 'mongoose';


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

}