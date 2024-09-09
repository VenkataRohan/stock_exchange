import { Consumer, Kafka } from 'kafkajs'
import { UserManager } from './UserManager';
export class SubscriptionManager {
    private static instance : SubscriptionManager;
    private kafka: Kafka;
    private consumer: Consumer;
    userToTopic: Map<string, string[]>;
    topicToUser: Map<string, string[]>;
    constructor() {
        this.kafka = new Kafka({ clientId: 'websocketClient', brokers: ['localhost:9092'] });
        this.consumer = this.kafka.consumer({ groupId: 'websocket-group' });
        this.consumer.connect();
        this.userToTopic = new Map();
        this.topicToUser = new Map();
    }

    public static getInstance(){
        if(!SubscriptionManager.instance){
            SubscriptionManager.instance = new SubscriptionManager();
        }
        return SubscriptionManager.instance;
    }

    public async subscribe(userId: string, subscription: string) {
        console.log('userId');
        console.log(userId);
        if (this.userToTopic.get(userId)?.includes(subscription)) return;


        console.log('userId');
        console.log(userId);

        
        this.userToTopic.set(userId, (this.userToTopic.get(userId) || []).concat(subscription));
        this.topicToUser.set(subscription, (this.topicToUser.get(subscription) || []).concat(userId));
        
        console.log("insider subscribe");
        console.log(this.topicToUser.get(subscription));
        
        if (this.topicToUser.get(subscription)?.length === 1) {
            const pausedTopicPartitions = this.consumer.paused()

            for (const topicPartitions of pausedTopicPartitions) {
                const { topic, partitions } = topicPartitions
                console.log({ topic, partitions })
                if(topic === subscription){
                    await this.consumer.resume([{ topic, partitions: [partitions[0]]}]);
                    return;
                }
            }

            await this.consumer.subscribe({ topic: subscription, fromBeginning: true })
            await this.consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    console.log({
                        topic,
                        partition,
                        value: message.value?.toString(),
                    })
                    this.topicToUser.get(topic)?.forEach((userId)=>UserManager.getInstance().getUser(userId)?.emit(message.value?.toString() || ""))
                }
            })
            console.log("subscribed");
            
        }
    }

    public async unsubscribe(userId: string, subscription: string) {
        const topics = this.userToTopic.get(userId);

        if (topics) {
            this.userToTopic.set(userId, topics.filter(e => e !== subscription))
            if(this.userToTopic.get(userId)?.length === 0){
                this.userToTopic.delete(userId);
            }
            console.log( this.userToTopic.get(userId));
        }

        const users = this.topicToUser.get(subscription);
        console.log(users);
        
        if (users) {
            this.topicToUser.set(subscription, users.filter(e => e !== userId));
            if (this.topicToUser.get(subscription)?.length === 0) {
                this.topicToUser.delete(subscription);
                this.userToTopic.set(userId, this.userToTopic.get(userId)?.filter(e => e !== subscription) || [])
                console.log( this.userToTopic.get(userId));
                
                this.consumer.pause([{ topic: subscription }]);
                console.log(this.consumer.paused());
                
                console.log("unsubscribed");
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