import { Channel, Connection, Replies, connect } from 'amqplib';
import { resolve } from 'path';
import { messageToDb, messageToEngine } from './types';


export class RabbitMqManager {
    private connection: Connection | null = null;
    private channel: Channel | null = null;
    private queue: Replies.AssertQueue | null = null
    constructor() { }


    public async connect() {
        if (!this.connection) {
            // this.connection = await connect('amqp://localhost');
            this.connection = await connect(`amqp://rabbitmq`);
            this.channel = await this.connection.createChannel();
            this.queue = await this.channel.assertQueue('', { exclusive: true });
        }
        //     let retries = 5;
        //     while (retries) {
        //         try {
        //             this.connection = await connect('amqp://rabbitmq');
        //             // this.connection = await connect(`amqp://localhost`);
        //             // this.connection = await connect(`amqp://${process.env.DOCKER_ENV === 'true' ? '192.168.1.5': 'localhost'}`);
        //             // this.connection = await connect(`amqp://192.168.1.5`);
        //             console.log('Connected to RabbitMQ');
        //         } catch (err) {
        //             retries -= 1;
        //             console.log(`RabbitMQ connection failed. Retrying in 5 seconds... (${retries} retries left)`);
        //             await new Promise(res => setTimeout(res, 5000));
        //         }
        //     }
        //     throw new Error('Failed to connect to RabbitMQ after multiple attempts');
        // }
    }

    public async sendAndAwait(msg: messageToEngine) {

    return new Promise<string>((resolve, reject) => {
        if (!this.channel || !this.queue) {
            resolve('no channel')
            return
        }
        const correlationId = this.getRandomId();
        this.channel.consume(this.queue.queue, function (msg) {
            if (msg?.properties.correlationId == correlationId) {
                // console.log(' [.] Got %s', msg?.content.toString());
                resolve(msg?.content.toString());
            }
        }, {
            noAck: true
        });

        this.channel.sendToQueue('rpc_queue',
            Buffer.from(JSON.stringify(msg)), {
            correlationId: correlationId,
            replyTo: this.queue.queue
        });
    })

}

    public async queryDb(msg: messageToDb) {

    return new Promise<string>((resolve, reject) => {
        if (!this.channel || !this.queue) {
            resolve('no channel')
            return
        }
        const correlationId = this.getRandomId();
        this.channel.consume(this.queue.queue, function (msg) {
            if (msg?.properties.correlationId == correlationId) {
                // console.log(' [.] Got %s', msg?.content.toString());
                resolve(msg?.content.toString());
            }
        }, {
            noAck: true
        });

        this.channel.sendToQueue('api_db_queue',
            Buffer.from(JSON.stringify(msg)), {
            correlationId: correlationId,
            replyTo: this.queue.queue
        });
    })

}

    private getRandomId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
}
