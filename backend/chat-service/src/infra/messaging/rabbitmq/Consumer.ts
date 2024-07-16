import amqp from 'amqplib';
import RabbitMQConnection from './RabbitMQConnection';
import { ConsumeMessage } from 'amqplib';
import UserRepository from '../../../app/repositories/UserRepository';

type QueueFunction = (msg: amqp.Message, channel: amqp.Channel, userRepository: UserRepository) => Promise<void>;

class Consumer {
    private static instance: Consumer;

    private constructor() { }

    static getInstance() {
        if (!Consumer.instance) {
            Consumer.instance = new Consumer();
        }
        return Consumer.instance;
    }

    async consume(queue: string) {
        try {
            const channel = RabbitMQConnection.getChannel();
            const userRepository = new UserRepository();

            if (!channel) {
                throw new Error('Channel is not available');
            }

            // Define your functions
            const functionMap: { [key: string]: QueueFunction } = {
                'user.registration': this.handleUserRegistration,
            };

            channel.assertQueue(queue, { durable: true });
            channel.consume(queue, async (msg) => {
                if (msg !== null) {
                    console.log(`Message received from queue ${queue}: ${msg.content.toString()}`);

                    // Check if the function exists for the queue
                    if (functionMap[queue]) {
                        await functionMap[queue](msg, channel, userRepository);
                    } else {
                        console.error(`No function mapped for queue: ${queue}`);
                    }
                    channel.ack(msg);
                }
            });
        } catch (error) {
            console.error('Failed to consume message:', error);
        }
    }
    private async handleUserRegistration(msg: amqp.Message, channel: amqp.Channel, userRepository: UserRepository) {
        const userData = JSON.parse(msg.content.toString());
        console.log("userData", userData);
        try {
            const newUser = await userRepository.create({
                ...userData
            });
            console.log(`User created in profile service: ${newUser._id}`);
        } catch (error) {
            console.error('Failed to create user in profile service:', error);
        }
    }
}

export default Consumer.getInstance();
