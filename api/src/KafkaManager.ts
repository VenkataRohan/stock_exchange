import { Consumer, Kafka, Producer } from 'kafkajs'

export class KafkaManager{

    private static instance : KafkaManager;
    private kafka : Kafka;
    private order_producer : Producer;
    private order_consumer : Consumer;

    private constructor(){
        this.kafka = new Kafka({clientId: 'my-app',brokers: ['localhost:9092']});

        this.order_producer =  this.kafka.producer();
        this.order_consumer = this.kafka.consumer({ groupId: 'test-group' });
        
        this.init();
    }

    private async init(){
        await this.order_producer.connect()
        await this.order_consumer.connect()
    }

    public static getInstance(){
        if(!this.instance){
            this.instance = new KafkaManager();
        }
        return this.instance;
    }

    public getProducer(): Producer {
        return this.order_producer;
      }
    
    public getConsumer(): Consumer {
        return this.order_consumer;
    }
}