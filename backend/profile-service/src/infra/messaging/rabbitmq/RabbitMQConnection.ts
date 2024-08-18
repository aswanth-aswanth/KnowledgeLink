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
            Consumer.consume('profile_queue');
            Consumer.consume('profile_queue2');
            Consumer.consume('profile_service_queue');
            Consumer.consume('user.registration');
            Consumer.consume('get_saved_posts_queue');
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
