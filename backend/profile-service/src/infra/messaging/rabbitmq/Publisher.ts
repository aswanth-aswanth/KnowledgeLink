import RabbitMQConnection from './RabbitMQConnection';

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
}

export default Publisher.getInstance();
