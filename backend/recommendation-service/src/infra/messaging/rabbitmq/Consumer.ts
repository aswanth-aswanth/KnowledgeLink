// src/infra/messaging/rabbitmq/Consumer.ts

import amqp from 'amqplib';
import RabbitMQConnection from './RabbitMQConnection';
import { ConsumeMessage } from 'amqplib';
import SaveRoadmap from '../../../app/useCases/Roadmap/SaveRoadmap';
import ProcessSingleRoadmap from '../../../app/useCases/Roadmap/ProcessSingleRoadmap';
import RoadmapRepository from '../../../app/repositories/RoadmapRepository';

class Consumer {
    private static instance: Consumer;

    private constructor() { }

    static getInstance() {
        if (!Consumer.instance) {
            Consumer.instance = new Consumer();
        }
        return Consumer.instance;
    }

    async consume(queue: string, callback: (msg: ConsumeMessage | null) => void) {
        try {
            const channel = RabbitMQConnection.getChannel();

            if (!channel) {
                throw new Error('Channel is not available');
            }

            channel.assertQueue(queue, { durable: true });
            channel.consume(queue, (msg) => {
                if (msg !== null) {
                    console.log(`Message received from queue ${queue}: ${msg.content.toString()}`);
                    callback(msg);
                    channel.ack(msg);
                }
            });
        } catch (error) {
            console.error('Failed to consume message:', error);
        }
    }

    async consumeRoadmapQueue() {
        const queue = 'recommendation_queue';
        const roadmapRepository = new RoadmapRepository();
        const processSingleRoadmap = new ProcessSingleRoadmap(roadmapRepository);

        this.consume(queue, async (msg) => {
            if (msg !== null) {
                const roadmapData = JSON.parse(msg.content.toString());
                const savedRoadmap = await roadmapRepository.create(roadmapData);
                await processSingleRoadmap.execute(savedRoadmap._id.toString());
                console.log(`Roadmap processed and ExtractedData created for roadmap: ${savedRoadmap._id}`);
            }
        });
    }
}

export default Consumer.getInstance();