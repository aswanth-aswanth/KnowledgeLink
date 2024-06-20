import amqp from 'amqplib';
import RabbitMQConnection from './RabbitMQConnection';
import UserRepository from '../../../app/repositories/UserRepository';

class Consumer {
    private static instance: Consumer;

    private constructor() { }

    static getInstance() {
        if (!Consumer.instance) {
            Consumer.instance = new Consumer();
        }
        return Consumer.instance;
    }

    async consume(queue: string) {
        try {
            const channel = RabbitMQConnection.getChannel();
            const userRepository = new UserRepository();

            if (!channel) {
                throw new Error('Channel is not available');
            }

            channel.assertQueue(queue, { durable: true });
            channel.consume(queue, async (msg) => {
                if (msg !== null) {
                    console.log(`Message received from queue ${queue}: ${msg.content.toString()}`);

                    const { userId } = JSON.parse(msg.content.toString());
                    const subscribed = await userRepository.getSubscribedRoadmaps(userId);

                    const response = JSON.stringify({ subscribed });
                    channel.sendToQueue(msg.properties.replyTo, Buffer.from(response), {
                        correlationId: msg.properties.correlationId,
                    });
                    channel.ack(msg);
                }
            });
        } catch (error) {
            console.error('Failed to consume message:', error);
        }
    }
}

export default Consumer.getInstance();
