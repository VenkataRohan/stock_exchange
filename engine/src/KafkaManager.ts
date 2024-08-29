import { Admin, Consumer, Kafka, Producer, KafkaMessage } from 'kafkajs'
import { resolve } from 'path';
import { messageFromEngine, messageToEngine } from './types';

export class KafkaManager {

    private static instance: KafkaManager;
    private kafka: Kafka;
    private orderProducer: Producer;
    private orderConsumer: Consumer;

    private constructor() {
        this.kafka = new Kafka({ clientId: 'my-app', brokers: ['localhost:9092'] });

        this.orderProducer = this.kafka.producer();
        this.orderConsumer = this.kafka.consumer({ groupId: 'test-group-engine' });
        this.init();
    }

    private async init() {
        await this.orderProducer.connect()
        await this.orderConsumer.connect()
        await this.orderConsumer.subscribe({ topic: 'test_order' })
        await this.orderConsumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                console.log({
                    topic,
                    partition,
                    value: message.value?.toString(),
                })
                if(message.value){
                //     console.log(message.value?.toString());
                //     console.log("asdfshdlfjhasdjfhasldjfhlkdsfhkldkjhflasdhfljkadshf");
                    const resp = JSON.parse(message.value.toString())
                    console.log(resp);
                    // if()
                    this.sendOrderStatus(resp.clientTopic, message.value.toString());
                }
            },
        })
    }

    public static getInstance() {
        if (!KafkaManager.instance) {
            KafkaManager.instance = new KafkaManager();
        }
        return this.instance;
    }

    public getProducer(): Producer {
        return this.orderProducer;
    }

    public async sendOrderStatus(topic: string, message: string) {
        this.orderProducer.send({
            topic: topic,
            messages: [
                { value: message.toString()}
            ]
        })
    }
}