import amqp from 'amqplib';
import Consumer from './Consumer';

class RabbitMQConnection {
    private static instance: RabbitMQConnection;
    private connection!: amqp.Connection;
    private channel!: amqp.Channel;

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
            this.connection = await amqp.connect('amqp://localhost');
            this.channel = await this.connection.createChannel();
            console.log('RabbitMQ connected successfully (profile-service)');
            Consumer.consume('profile_queue');
            Consumer.consume('profile_queue2');
            Consumer.consume('profile_service_queue');
            Consumer.consume('user.registration');
            Consumer.consume('get_saved_posts_queue');
        } catch (error) {
            console.error('Failed to connect to RabbitMQ (profile-service):', error);
        }
    }

    getChannel() {
        return this.channel;
    }
}

export default RabbitMQConnection.getInstance();
