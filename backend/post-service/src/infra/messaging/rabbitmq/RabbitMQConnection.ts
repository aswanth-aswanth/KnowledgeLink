import amqp from 'amqplib';
import Consumer from './Consumer';
class RabbitMQConnection {
    private static instance: RabbitMQConnection;
    private connection!: amqp.Connection;
    private channel!: amqp.Channel;
    private retryInterval: number = 5000;
    private maxRetries: number = 10;
    private retryCount: number = 0;

    private constructor() {
        this.connect();
    }

    static getInstance() {
        if (!RabbitMQConnection.instance) {
            RabbitMQConnection.instance = new RabbitMQConnection();
        }
        return RabbitMQConnection.instance;
    }

    private async connect() {
        try {
            this.connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost:5672');
            this.channel = await this.connection.createChannel();
            console.log('RabbitMQ connected successfully (post-service)');

            const queueName = 'post_service_queue';
            await this.channel.assertExchange('user.registration.fanout', 'fanout', { durable: true });
            const q = await this.channel.assertQueue(queueName, { durable: true });
            await this.channel.bindQueue(q.queue, 'user.registration.fanout', '');

            Consumer.consume(queueName);
        } catch (error) {
            this.retryCount++;
            console.error(`Failed to connect to RabbitMQ (post-service). Attempt ${this.retryCount} of ${this.maxRetries}:`, error);

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

    getChannel() {
        return this.channel;
    }
}

export default RabbitMQConnection.getInstance();

