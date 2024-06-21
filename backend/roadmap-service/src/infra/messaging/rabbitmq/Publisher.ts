import { v4 as uuidv4 } from 'uuid';
import RabbitMQConnection from './RabbitMQConnection';
import { ConsumeMessage } from 'amqplib';

class Publisher {
    private static instance: Publisher;

    private constructor() { }

    static getInstance() {
        if (!Publisher.instance) {
            Publisher.instance = new Publisher();
        }
        return Publisher.instance;
    }

    async publish(queue: string, message: string) {
        try {
            const channel = RabbitMQConnection.getChannel();

            if (!channel) {
                throw new Error('Channel is not available');
            }

            channel.assertQueue(queue, { durable: true });
            channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
            console.log(`Message sent to queue ${queue}: ${message}`);
        } catch (error) {
            console.error('Failed to publish message:', error);
        }
    }

    async publishAndWait(queue: string, message: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const correlationId = uuidv4();
            const replyQueue = 'amq.rabbitmq.reply-to';

            const channel = RabbitMQConnection.getChannel();
            if (!channel) {
                return reject(new Error('Channel is not available'));
            }
            channel.consume(replyQueue, (msg) => {
                if (msg && msg.properties.correlationId === correlationId) {
                    resolve(msg.content.toString());
                }
            }, { noAck: true });

            channel.sendToQueue(queue, Buffer.from(message), {
                correlationId,
                replyTo: replyQueue,
                persistent: true
            });
            console.log(`Message sent to queue ${queue}: ${message}`);
        });
    }
}

export default Publisher.getInstance();