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
        const connection = await amqp.connect('amqp://localhost');
        this.channel = await connection.createChannel();
    }

    async publish(queue: string, message: string) {
        if (!this.channel) {
            await this.connect();
        }
        this.channel.assertQueue(queue, { durable: true });
        this.channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
    }
}

export default Publisher;
