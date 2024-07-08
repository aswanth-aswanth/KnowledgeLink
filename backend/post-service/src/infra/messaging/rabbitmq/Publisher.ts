import { v4 as uuidv4 } from 'uuid';
import RabbitMQConnection from './RabbitMQConnection';
import { ConsumeMessage, Channel } from 'amqplib';

class Publisher {
    private static instance: Publisher;
    private correlationMap: Map<string, (value: string) => void> = new Map();
    private replyConsumerSetup = false;

    private constructor() { }

    static getInstance() {
        if (!Publisher.instance) {
            Publisher.instance = new Publisher();
        }
        return Publisher.instance;
    }

    private async getChannel(): Promise<Channel> {
        const connection = RabbitMQConnection;
        let retries = 0;
        const maxRetries = 5;

        while (retries < maxRetries) {
            const channel = connection.getChannel();
            if (channel) {
                return channel;
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
            retries++;
        }

        throw new Error('Failed to get RabbitMQ channel after multiple attempts');
    }

    private async setupReplyConsumer() {
        if (this.replyConsumerSetup) return;

        const channel = await this.getChannel();
        const replyQueue = 'amq.rabbitmq.reply-to';

        await channel.consume(replyQueue, (msg) => {
            if (msg && msg.properties.correlationId) {
                const resolve = this.correlationMap.get(msg.properties.correlationId);
                if (resolve) {
                    resolve(msg.content.toString());
                    this.correlationMap.delete(msg.properties.correlationId);
                }
            }
        }, { noAck: true });

        this.replyConsumerSetup = true;
    }

    async publish(queue: string, message: string) {
        try {
            const channel = await this.getChannel();

            await channel.assertQueue(queue, { durable: true });
            channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
            console.log(`Message sent to queue ${queue}: ${message}`);
        } catch (error) {
            console.error('Failed to publish message:', error);
            throw error;
        }
    }

    async publishAndWait(queue: string, message: string): Promise<string> {
        await this.setupReplyConsumer();

        return new Promise((resolve, reject) => {
            const correlationId = uuidv4();
            const replyQueue = 'amq.rabbitmq.reply-to';

            this.getChannel().then(channel => {
                this.correlationMap.set(correlationId, resolve);

                channel.sendToQueue(queue, Buffer.from(message), {
                    correlationId,
                    replyTo: replyQueue,
                    persistent: true
                });
                console.log(`Message sent to queue ${queue}: ${message}`);

                // Set a timeout to remove the correlationId if no response is received
                setTimeout(() => {
                    if (this.correlationMap.has(correlationId)) {
                        this.correlationMap.delete(correlationId);
                        reject(new Error('Request timed out'));
                    }
                }, 30000); // 30 seconds timeout
            }).catch(error => {
                reject(error);
            });
        });
    }
}

export default Publisher.getInstance();