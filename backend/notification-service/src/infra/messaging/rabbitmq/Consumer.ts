import amqp from 'amqplib';
import RabbitMQConnection from './RabbitMQConnection';
import NotificationRepository from '../../../app/repositories/NotificationRepository';
import SocketService from '../../services/SocketService';

class Consumer {
    private static instance: Consumer;
    private notificationRepository: NotificationRepository;
    private socketService: SocketService;

    private constructor() {
        this.notificationRepository = new NotificationRepository();
        this.socketService = SocketService.getInstance();
    }

    static getInstance() {
        if (!Consumer.instance) {
            Consumer.instance = new Consumer();
        }
        return Consumer.instance;
    }

    async consume(queue: string) {
        try {
            const channel = RabbitMQConnection.getChannel();

            if (!channel) {
                throw new Error('Channel is not available');
            }

            await channel.assertQueue(queue, { durable: true });
            console.log(`Waiting for messages in ${queue}`);

            channel.consume(queue, async (msg) => {
                if (msg !== null) {
                    const content = JSON.parse(msg.content.toString());
                    console.log(`Received message from queue ${queue}:`, content);

                    await this.handleMessage(content);

                    channel.ack(msg);
                }
            });
        } catch (error) {
            console.error('Failed to consume message:', error);
        }
    }

    private async handleMessage(content: any) {
        try {
            let notificationContent = '';
            let socketMessage = '';

            switch (content.type) {
                case 'like':
                    notificationContent = `${content.liker} liked your post`;
                    socketMessage = `${content.liker} liked your post`;
                    break;
                case 'comment':
                    notificationContent = `${content.liker} commented on your post`;
                    socketMessage = `${content.liker} commented on your post`;
                    break;
                default:
                    console.log(`Unknown notification type: ${content.type}`);
                    return;
            }

            await this.notificationRepository.save({
                recipient: content.postOwner,
                notification: {
                    type: content.type,
                    content: notificationContent,
                    createdAt: new Date(),
                    read: false
                }
            });

            this.socketService.sendNotification(content.postOwner, {
                type: content.type,
                message: socketMessage,
                postId: content.postId
            });
        } catch (error) {
            console.error('Error handling message:', error);
        }
    }
}

export default Consumer.getInstance();