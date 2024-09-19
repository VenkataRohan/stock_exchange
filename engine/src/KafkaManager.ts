import { Admin, Consumer, Kafka, Producer, KafkaMessage,Partitioners } from 'kafkajs'
import { resolve } from 'path';
import { fills, messageFromApi, messageToApi, order } from './types';
import { Engine } from './trades/Engine';

export class KafkaManager {

    private static instance: KafkaManager;
    private kafka: Kafka;
    private orderProducer: Producer;
    private orderConsumer: Consumer;
    private produceractive = false;
    private engine : Engine
    private constructor() {
        this.kafka = new Kafka({ clientId: 'my-app', brokers: ['localhost:9092'] });

        this.orderProducer = this.kafka.producer({createPartitioner: Partitioners.DefaultPartitioner});
        this.orderProducer = this.kafka.producer();
        this.orderConsumer = this.kafka.consumer({ groupId: 'test-group-engine' });
        this.engine = new Engine();
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
                    const resp = JSON.parse(message.value.toString())
                    console.log(resp);
                    this.engine.log()
                    const response =await this.engine.process(resp.message)
                    console.log(response);
                    console.log(JSON.stringify(response));
                    this.engine.log();
                    
                    // if()
                    this.sendOrderStatus(resp.clientTopic, JSON.stringify(response) || '');
                }
            },
        })
        this.produceractive = true;
    }

    public static getInstance() {
        
        if (!KafkaManager.instance) {
            KafkaManager.instance = new KafkaManager();
        }
        return KafkaManager.instance;
    }

    public getProducer(): Producer {
        return this.orderProducer;
    }

    public updateTradesDB(fills : fills[]){
        fills.forEach((fill)=>{
            const data = {
                type: 'TRADE_ADDED',
                data: {
                    symbol: fill.symbol ,
                    id: fill.tradeId.toString(),
                    price: fill.price,
                    quantity: fill.quantity.toString(),
                    timestamp: Date.now()
                }
            }
                this.orderProducer.send({
                    topic : "",
                    messages: [
                        { value: data.toString()}
                    ]
                })
        })
    }

    public updateOrdersDB(order : order,fills : fills[],executedQty : string){

        const data = {
            type: 'ORDER_UPDATE',
            data: {
                orderId: order.orderId,
                executedQty: executedQty,
                symbol: order.symbol,
                price: order.price.toString(),
                quantity: order.quantity.toString(),
                side: order.side,
            }
        }
            this.orderProducer.send({
                topic : "",
                messages: [
                    { value: data.toString()}
                ]
            })

        fills.forEach((fill)=>{
            const data = {
                type: 'ORDER_UPDATE',
                data: {
                    orderId: fill.orderId,
                    executedQty: executedQty,
                }
            }
                this.orderProducer.send({
                    topic : "",
                    messages: [
                        { value: data.toString()}
                    ]
                })
        })
    }


    public async sendOrderStatus(topic: string, message: string) {
        this.orderProducer.send({
            topic: topic,
            messages: [
                { value: message.toString()}
            ]
        })
    }

    public async sendWsUpdates(topic:string,message:string){
        if(!this.produceractive){
            await this.init();
        }
        console.log("toipc :"+ topic);
        
        this.orderProducer.send({
            topic: topic,
            messages: [
                { value: message.toString()}
            ]
        })
    }
}