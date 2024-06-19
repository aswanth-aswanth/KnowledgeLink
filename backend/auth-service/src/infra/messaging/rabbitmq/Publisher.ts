import amqp from 'amqplib';

class Publisher {
    private static instance: Publisher;
    private channel!: amqp.Channel;

    private constructor() { }

    static async getInstance() {
        if (!Publisher.instance) {
            Publisher.instance = new Publisher();
            await Publisher.instance.connect();
        }
        return Publisher.instance;
    }

    private async connect() {
        try {
            const connection = await amqp.connect('amqp://localhost');
            this.channel = await connection.createChannel();
            console.log('RabbitMQ connected successfully (auth-service)');
        } catch (error) {
            console.error('Failed to connect to RabbitMQ:', error);
        }
    }

    async publish(queue: string, message: string) {
        try {
            if (!this.channel) {
                await this.connect();
            }
            this.channel.assertQueue(queue, { durable: true });
            this.channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
            console.log(`Message sent to queue ${queue}: ${message}`);
        } catch (error) {
            console.error('Failed to publish message:', error);
        }
    }
}

export default Publisher;
