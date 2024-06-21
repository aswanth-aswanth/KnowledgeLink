import amqp from 'amqplib';
import RabbitMQConnection from './RabbitMQConnection';
import { ConsumeMessage } from 'amqplib';

class Consumer {
    private static instance: Consumer;

    private constructor() { }

    static getInstance() {
        if (!Consumer.instance) {
            Consumer.instance = new Consumer();
        }
        return Consumer.instance;
    }

    async consume(queue: string, callback: (msg: ConsumeMessage | null) => void) {
        try {
            const channel = RabbitMQConnection.getChannel();

            if (!channel) {
                throw new Error('Channel is not available');
            }

            channel.assertQueue(queue, { durable: true });
            channel.consume(queue, (msg) => {
                if (msg !== null) {
                    console.log(`Message received from queue ${queue}: ${msg.content.toString()}`);
                    callback(msg);
                    channel.ack(msg);
                }
            });
        } catch (error) {
            console.error('Failed to consume message:', error);
        }
    }
}

export default Consumer.getInstance();
