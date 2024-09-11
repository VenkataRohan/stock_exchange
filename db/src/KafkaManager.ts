import {Consumer, Kafka} from 'kafkajs'
class KafkaManager{
    private static instance : KafkaManager;
    private consumer : Consumer;
    private kafka : Kafka;

    constructor(){
        this.kafka = new Kafka({ clientId: 'my-app', brokers: ['localhost:9092'] });
        this.consumer = this.kafka.consumer({groupId : 'db-consumer'});
        this.init();
    }

    private async init() {
        await this.consumer.connect()
        await this.consumer.subscribe({ topic: 'db-processor' })
        await this.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                console.log({
                    topic,
                    partition,
                    value: message.value?.toString(),
                })
                if(message.value){
                    const resp = JSON.parse(message.value.toString())
                    console.log(resp);
                    this.saveInDB();
                }
            },
        })
    }

    public getInstance(){
        if(!KafkaManager.instance){
            KafkaManager.instance = new KafkaManager();
        }
        return KafkaManager.instance;
    }

    
    public saveInDB(){
        
    }



}