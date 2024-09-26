import { Channel, Connection, Replies, connect } from 'amqplib';
import { GET_TRADE, LOGIN, TRADE_ADDED, fills, messageFromApi, messageFromEngine, SIGNUP, GET_TICKER, ticker } from './types';
import prisma from './prisma';
import { Prisma } from '@prisma/client';

export class RabbitMqManager {
    private static instance: RabbitMqManager;
    private connection: Connection | null = null;
    private channel: Channel | null = null;

    constructor() { }

    public async connect() {
        if (!this.connection) {
            this.connection = await connect('amqp://localhost');
            this.channel = await this.connection.createChannel();
            await this.channel.assertQueue('api_db_queue', { durable: true })
            await this.channel.assertQueue('db_queue', { durable: true })
            await this.channel.consume(
                'db_queue',
                async (msg) => {
                    if (msg) {
                        console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
                        this.process(JSON.parse(msg.content.toString()))
                    }
                },
                { noAck: true }
            );

            await this.channel.consume(
                'api_db_queue',
                async (msg) => {
                    if (msg) {
                        console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
                        const response = await this.process(JSON.parse(msg.content.toString()))
                        console.log(response);
                        if (response)
                            this.channel?.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(response)), {
                                correlationId: msg.properties.correlationId
                            });
                        this.channel?.ack(msg);
                    }
                }
            );
            console.log('conumer waiting');

        }
    }

    public static getInstance() {
        if (!RabbitMqManager.instance) {
            RabbitMqManager.instance = new RabbitMqManager();
        }
        return RabbitMqManager.instance;
    }


    private async process(message: messageFromEngine | messageFromApi) {
        switch (message.type) {
            case TRADE_ADDED:
                console.log(await this.updateTrade(message.data));
                return;
            case GET_TRADE:
                return await this.getTrade(message.data)
            case LOGIN:
                return await this.login(message);
            case SIGNUP:
                return await this.signup(message);
            case GET_TICKER:
                return await this.getTicker(message.data);
            default:
                break;
        }
    }


    private async updateTrade(fill: fills) {
        await prisma.trade.create({
            data: {
                orderId: fill.orderId as string,
                orderType: fill.orderType,
                symbol: fill.symbol,
                price: fill.price.toString(),
                quantity: fill.quantity.toString(),
                status: fill.status,
                side: fill.side,
                filled: fill.filled.toString(),
                userId: fill.userId,
                otherUserId: fill.otherUserId
            }
        })

        await prisma.stock.create({
            data: {
                symbol: fill.symbol,
                price: fill.price.toString(),
                time: fill.ts
            }
        })
    }


    private async getTrade({ symbol }: { symbol: string }) {
        return await prisma.trade.findMany({
            where: {
                symbol: symbol
            }
        })
    }

    private async getTicker({ symbol }: { symbol: string }) {

        const result : ticker[] = await prisma.$queryRaw`
    SELECT
        to_char(time_bucket('1 day', "time"), 'YYYY-MM-DD')  AS time,
        "symbol",
        first(CAST("price" AS FLOAT), "time") AS open,
        max(CAST("price" AS FLOAT)) AS high,
        min(CAST("price" AS FLOAT)) AS low,
        last(CAST("price" AS FLOAT), "time") AS close
    FROM stock
    WHERE "symbol" = ${Prisma.sql`${symbol}`}
    GROUP BY  to_char(time_bucket('1 day', "time"), 'YYYY-MM-DD'), "symbol" `;

        return result;
    }

    private async login(message: any) {
        const user = await prisma.user.findUnique({
            where: {
                email: message.data.email,
            }
        })

        return user;
    }

    private async signup(message: any) {
        const existingUser = await prisma.user.findUnique({
            where: {
                email: message.data.email
            }
        })

        if (existingUser) {
            throw new Error("User Already Exists")
            // return {msg : "User Already Exists"}
        }

        const user = await prisma.user.create({
            data: {
                email: message.data.email,
                password: message.data.password,
                name: message.data.name,
            }
        })

        return { msg: "user creation success", user }
    }
}