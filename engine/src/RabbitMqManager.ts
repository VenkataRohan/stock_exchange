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
            this.connection = await connect('amqp://localhost');
            this.channel = await this.connection.createChannel();
            await this.channel.assertExchange('WsUpdates', 'direct', { durable: false });
            await this.channel.assertQueue('db_queue',{durable: true})
            this.queue = await this.channel.assertQueue('rpc_queue', {
                durable: false
            });
            await this.channel.prefetch(1);
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
                    console.log(message);
                    this.engine.log()
                    const response = await this.engine.process(message)
                    console.log(response);
                    this.engine.log();
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
        console.log(topic);

        this.channel.publish('WsUpdates', topic, Buffer.from(msg));
    }

    public async sendDbUpdates(topic: string, msg: string) {
        
        if (!this.channel || !this.queue) {
            return;
        }
        console.log(topic);

        this.channel.sendToQueue('db_queue',Buffer.from(msg),{persistent: true})
    }
}
