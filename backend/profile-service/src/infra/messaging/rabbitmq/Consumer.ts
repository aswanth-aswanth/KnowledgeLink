import amqp from 'amqplib';
import RabbitMQConnection from './RabbitMQConnection';
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

            const functionMap: { [key: string]: QueueFunction } = {
                'profile_queue': this.getSubscribedRoadmaps,
                'profile_service_queue': this.getAllMembersOfRoadmap,
                'profile_queue2': this.getFollowingList,
                'get_saved_posts_queue': this.getSavedPosts,
                'profile_user_registration_queue': this.handleUserRegistration,
            };

            await channel.assertQueue(queue, { durable: true });
            channel.consume(queue, async (msg) => {
                if (msg !== null) {
                    console.log(`Message received from queue ${queue}: ${msg.content.toString()}`);

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

    private async getSubscribedRoadmaps(msg: amqp.Message, channel: amqp.Channel, userRepository: UserRepository) {
        const { userId } = JSON.parse(msg.content.toString());
        const subscribed = await userRepository.getSubscribedRoadmaps(userId);

        const response = JSON.stringify({ subscribed });
        channel.sendToQueue(msg.properties.replyTo, Buffer.from(response), {
            correlationId: msg.properties.correlationId,
        });
    }

    private async getSavedPosts(msg: amqp.Message, channel: amqp.Channel, userRepository: UserRepository) {
        const { userId } = JSON.parse(msg.content.toString());
        const savedPosts = await userRepository.getSavedPosts(userId);

        const response = JSON.stringify({ savedPosts });
        channel.sendToQueue(msg.properties.replyTo, Buffer.from(response), {
            correlationId: msg.properties.correlationId,
        });
    }

    private async getAllMembersOfRoadmap(msg: amqp.Message, channel: amqp.Channel, userRepository: UserRepository) {
        const { members } = JSON.parse(msg.content.toString());
        const users = await userRepository.findUsersById(members);
        const response = JSON.stringify({ users });
        channel.sendToQueue(msg.properties.replyTo, Buffer.from(response), {
            correlationId: msg.properties.correlationId,
        });
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

    private async getFollowingList(msg: amqp.Message, channel: amqp.Channel, userRepository: UserRepository) {
        const { userId } = JSON.parse(msg.content.toString());
        const user = await userRepository.findById(userId);
        const following = user ? user.following : [];

        const response = JSON.stringify({ following });
        channel.sendToQueue(msg.properties.replyTo, Buffer.from(response), {
            correlationId: msg.properties.correlationId,
        });
    }
}

export default Consumer.getInstance();