import { Channel, Connection, Replies, connect } from 'amqplib';
import { UserManager } from './UserManager';
export class SubscriptionManager {
    private static instance : SubscriptionManager;
    private connection: Connection | null = null;
    private channel: Channel | null = null;
    private queue: Replies.AssertQueue | null = null
    userToTopic: Map<string, string[]>;
    topicToUser: Map<string, string[]>;
    constructor() {
        this.userToTopic = new Map();
        this.topicToUser = new Map();
    }

    public async connect(){
        if (!this.connection) {
            // this.connection = await connect(`amqp://localhost`);
            this.connection = await connect(`amqp://rabbitmq`);
            // this.connection = await connect(`amqp://192.168.1.9`);
            this.channel = await this.connection.createChannel();
            await this.channel.assertExchange('WsUpdates', 'direct', { durable: false });
            this.queue = await this.channel.assertQueue('', { exclusive: true });
            await this.channel.consume(
                this.queue.queue,
                async (msg) => {
                    if (msg) {
                        // console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
                        this.topicToUser.get( msg.fields.routingKey)?.forEach((userId)=>UserManager.getInstance().getUser(userId)?.emit(msg.content.toString() || ""))
                    }
                },
                { noAck: true }
            );
            console.log('conumer waiting');
            
        }
    }

    public static getInstance(){
        if(!SubscriptionManager.instance){
            SubscriptionManager.instance = new SubscriptionManager();
        }
        return SubscriptionManager.instance;
    }

    public async subscribe(userId: string, subscription: string) {
        if (this.userToTopic.get(userId)?.includes(subscription)) return;
        
        this.userToTopic.set(userId, (this.userToTopic.get(userId) || []).concat(subscription));
        this.topicToUser.set(subscription, (this.topicToUser.get(subscription) || []).concat(userId));
        
        if (this.topicToUser.get(subscription)?.length === 1) {

            if (!this.channel || !this.queue) return;
            await this.channel.bindQueue(this.queue.queue, 'WsUpdates', subscription);
        }
    }

    public async unsubscribe(userId: string, subscription: string) {
        const topics = this.userToTopic.get(userId);

        if (topics) {
            this.userToTopic.set(userId, topics.filter(e => e !== subscription))
            if(this.userToTopic.get(userId)?.length === 0){
                this.userToTopic.delete(userId);
            }
        }
        const users = this.topicToUser.get(subscription);
        if (users) {
            this.topicToUser.set(subscription, users.filter(e => e !== userId));
            if (this.topicToUser.get(subscription)?.length === 0) {
                this.topicToUser.delete(subscription);
                this.userToTopic.set(userId, this.userToTopic.get(userId)?.filter(e => e !== subscription) || [])
                if (!this.channel || !this.queue) return;
                await this.channel.unbindQueue(this.queue.queue, 'WsUpdates', subscription);                
            }
        }
    }
    public userLeft(userId: string) {
        this.userToTopic.get(userId)?.forEach(e => this.unsubscribe(userId, e));
        this.userToTopic.delete(userId)
    }

    public getSubscriptions(userId: string) {
        return this.userToTopic.get(userId) || [];
    }
}