import amqp from 'amqplib';

class Consumer {
    private static instance: Consumer;
    private channel!: amqp.Channel;

    private constructor() { }

    static async getInstance() {
        if (!Consumer.instance) {
            Consumer.instance = new Consumer();
            await Consumer.instance.connect();
        }
        return Consumer.instance;
    }

    private async connect() {
        try {
            const connection = await amqp.connect('amqp://localhost');
            this.channel = await connection.createChannel();
            console.log('RabbitMQ connected successfully (profile-service)');
        } catch (error) {
            console.error('Failed to connect to RabbitMQ:', error);
        }
    }

    async consume(queue: string, callback: (msg: amqp.ConsumeMessage | null) => void) {
        try {
            if (!this.channel) {
                await this.connect();
            }
            this.channel.assertQueue(queue, { durable: true });
            this.channel.consume(queue, (msg) => {
                console.log(`Message received from queue ${queue}: ${msg?.content.toString()}`);
                callback(msg);
            }, { noAck: true });
            console.log(`Consumer started for queue ${queue}`);
        } catch (error) {
            console.error('Failed to consume message:', error);
        }
    }
}

export default Consumer;
