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
            console.log('RabbitMQ connected successfully (profile-service)');

            await this.channel.assertExchange('user.registration.fanout', 'fanout', { durable: true });

            const queues = ['profile_queue', 'profile_queue2', 'profile_service_queue', 'get_saved_posts_queue'];
            for (const queue of queues) {
                await this.channel.assertQueue(queue, { durable: true });
            }

            await this.channel.bindQueue('profile_queue', 'user.registration.fanout', '');
            await this.channel.bindQueue('profile_queue2', 'user.registration.fanout', '');
            await this.channel.bindQueue('profile_service_queue', 'user.registration.fanout', '');
            await this.channel.bindQueue('get_saved_posts_queue', 'user.registration.fanout', '');

            for (const queue of queues) {
                Consumer.consume(queue);
            }
        } catch (error) {
            this.retryCount++;
            console.error(`Failed to connect to RabbitMQ (profile-service). Attempt ${this.retryCount} of ${this.maxRetries}:`, error);

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
