import { Channel, Connection, Replies, connect } from 'amqplib';
import { Engine } from './trades/Engine';

export class RabbitMqManager {
    private static instance: RabbitMqManager;
    private connection: Connection | null = null;
    private channel: Channel | null = null;
    private queue: Replies.AssertQueue | null = null
    private engine: Engine;
    constructor() {
        this.engine = new Engine();
    }

    public static getInstance() {

        if (!RabbitMqManager.instance) {
            RabbitMqManager.instance = new RabbitMqManager();
        }
        return RabbitMqManager.instance;
    }

    public async connect() {
        if (!this.connection) {
            // this.connection = await connect('amqp://localhost');
            // this.connection = await connect('amqp://rabbitmq');
            this.connection = await connect(`amqp://192.168.1.9`);
            this.channel = await this.connection.createChannel();
            await this.channel.assertExchange('WsUpdates', 'direct', { durable: false });
            await this.channel.assertQueue('db_queue',{durable: true})
            this.queue = await this.channel.assertQueue('rpc_queue', {
                durable: false
            });
            await this.channel.prefetch(1);
            // let retries = 5;
            // while (retries) {
            //     try {
            //         this.connection = await connect('amqp://rabbitmq');
            //         // this.connection = await connect(`amqp://localhost`);
            //         // this.connection = await connect(`amqp://${process.env.DOCKER_ENV === 'true' ? '192.168.1.5': 'localhost'}`);
            //         // this.connection = await connect(`amqp://192.168.1.5`);
            //         console.log('Connected to RabbitMQ');
            //         this.channel = await this.connection.createChannel();
            //         await this.channel.assertExchange('WsUpdates', 'direct', { durable: false });
            //         await this.channel.assertQueue('db_queue', { durable: true })
            //         this.queue = await this.channel.assertQueue('rpc_queue', {
            //             durable: false
            //         });
            //         await this.channel.prefetch(1);
            //     } catch (err) {
            //         retries -= 1;
            //         console.log(`RabbitMQ connection failed. Retrying in 5 seconds... (${retries} retries left)`);
            //         await new Promise(res => setTimeout(res, 5000));
            //     }
            // }
            // throw new Error('Failed to connect to RabbitMQ after multiple attempts');
            // // this.connection = await connect(`amqp://localhost`);
            // // this.connection = await connect(`amqp://${process.env.DOCKER_ENV === 'true' ? '192.168.1.5': 'localhost'}`);
            // this.connection = await connect(`amqp://rabbitmq`);
        }
    }

    public async consume() {
        if (!this.channel || !this.queue) return;

        console.log(' [*] Waiting for RPC requests');

        await this.channel.consume(
            this.queue.queue,
            async (msg) => {
                if (msg) {
                    const message = JSON.parse(msg.content.toString())
                    const response = await this.engine.process(message)
                    this.channel?.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(response)), {
                        correlationId: msg.properties.correlationId
                    });
                    this.channel?.ack(msg);
                }
            },
        );
    }

    public async sendWsUpdates(topic: string, msg: string) {

        if (!this.channel || !this.queue) {
            return;
        }

        this.channel.publish('WsUpdates', topic, Buffer.from(msg));
    }

    public async sendDbUpdates(topic: string, msg: string) {

        if (!this.channel || !this.queue) {
            return;
        }

        this.channel.sendToQueue('db_queue', Buffer.from(msg), { persistent: true })
    }
}
