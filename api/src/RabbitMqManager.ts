import { Channel, Connection, Replies, connect } from 'amqplib';
import { resolve } from 'path';
import { messageToEngine } from './types';


export class RabbitMqManager {
    private connection: Connection | null = null;
    private channel: Channel | null = null;
    private queue: Replies.AssertQueue | null = null
    constructor() { }


    public async connect() {
        if (!this.connection) {
            this.connection = await connect('amqp://localhost');
            this.channel = await this.connection.createChannel();
            this.queue = await this.channel.assertQueue('', { exclusive: true });
        }
    }

    public async sendAndAwait(msg: messageToEngine) {
          
        return new Promise<string>((resolve,reject)=>{
            if (!this.channel || !this.queue) {
                resolve('no channel')
                return
            }
            const correlationId = this.getRandomId();
            this.channel.consume(this.queue.queue, function (msg) {
                if (msg?.properties.correlationId == correlationId) {
                    console.log(' [.] Got %s', msg?.content.toString());
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

    private getRandomId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
}
