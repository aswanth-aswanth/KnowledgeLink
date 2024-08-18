import amqp from 'amqplib';

class Publisher {
    private static instance: Publisher;
    private channel!: amqp.Channel;
    private retryInterval: number = 5000;
    private maxRetries: number = 10;
    private retryCount: number = 0;

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
            const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost:5672');
            this.channel = await connection.createChannel();
            console.log('RabbitMQ connected successfully (auth-service)');
            this.retryCount = 0;
        } catch (error) {
            this.retryCount++;
            console.error(`Failed to connect to RabbitMQ (auth-service). Attempt ${this.retryCount} of ${this.maxRetries}:`, error);

            if (this.retryCount < this.maxRetries) {
                setTimeout(() => {
                    console.log('Retrying to connect to RabbitMQ...');
                    this.connect();
                }, this.retryInterval);
            } else {
                console.error('Exceeded maximum retry attempts. Exiting...');
                process.exit(1);
            }
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
