import { Admin, Consumer, Kafka, Producer, KafkaMessage } from 'kafkajs'
import { messageFromEngine, messageToEngine } from './types';

export class KafkaManager {

    private static instance: KafkaManager;
    private kafka: Kafka;
    private kafkaAdmin: Admin;
    private orderProducer: Producer;
    private orderConsumers: Map<string, Consumer>;
    private isConnected: boolean;

    private constructor() {
        this.kafka = new Kafka({ clientId: 'my-app', brokers: ['localhost:9092'] });
        console.log("consturucter");

        this.orderProducer = this.kafka.producer();
        this.orderConsumers = new Map();
        this.kafkaAdmin = this.kafka.admin();
        this.isConnected = false;
        // this.init();
    }

    private async init() {
        await this.orderProducer.connect()
        await this.kafkaAdmin.connect();
        this.isConnected = true
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new KafkaManager();
        }
        return this.instance;
    }

    public getProducer(): Producer {
        return this.orderProducer;
    }

    public async createConsumer(topic: string): Promise<Consumer> {
        const consumer = this.kafka.consumer({ groupId: `test-group-${topic}` })
        await consumer.connect()
        await consumer.subscribe({ topic: topic, fromBeginning: true })

        return consumer;
    }

    private async createTopic(topic: string, numPartitions: number = 1, replicationFactor: number = 1): Promise<void> {
        try {
            const topicConfig = {
                topic,
                numPartitions,
                replicationFactor,
            };

            await this.kafkaAdmin.createTopics({
                topics: [topicConfig],
                waitForLeaders: true,
            });

            console.log(`Topic ${topic} created successfully!`);
        } catch (error) {
            console.error('Failed to create topic:', error);
        }
    }
    private async deleteTopic(topic: string): Promise<void> {
        try {

            await this.kafkaAdmin.deleteTopics({
                topics: [topic],
                timeout: 10000
            })

            console.log(`Topic ${topic} removed successfully!`);
        } catch (error) {
            console.error('Failed to remove topic:', error);
        }
    }

    private async deleteCousumer(topic: string): Promise<void> {
        try {
            await this.orderConsumers.get(topic)?.stop();
            await this.orderConsumers.get(topic)?.disconnect();

            this.orderConsumers.delete(topic)
            console.log(`Consumer ${topic} removed successfully!`);
        } catch (error) {
            console.error('Failed to remove consumer:', error);
        }
    }

    public async sendAndAwait(message: messageToEngine) {
        return new Promise<string>(async (resolve, reject) => {
            if (!this.isConnected) {
                await this.init()
            }

            const clientTopic = this.getRandomClientId();
            await this.createTopic(clientTopic);
            const consumer = await this.createConsumer(clientTopic);
            this.orderConsumers.set(clientTopic, consumer);

            await this.orderProducer.send({
                topic: 'test_order',
                messages: [
                    { value: JSON.stringify({ clientTopic, message }) },
                ],
            })

            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    console.log({
                        topic,
                        partition,
                        value: message.value?.toString(),
                    })
                    await this.deleteTopic(clientTopic);
                    this.deleteCousumer(clientTopic);

                    resolve(message.value?.toString() || "")
                },
            })

        })
    }
    public getRandomClientId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

}