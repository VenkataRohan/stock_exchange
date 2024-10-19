import { Router } from "express";
import { GET_CURRENTPRICE, GET_TICKER } from "../types";
import { RabbitMqManager } from "../RabbitMqManager";
export const tickerRouter = Router();

tickerRouter.get('/', async (req, res) => {
    const symbol = req.query.symbol
    const rabbitMqManager = new RabbitMqManager();
    await rabbitMqManager.connect();
    const response = await rabbitMqManager.queryDb({
        type: GET_TICKER,
        data: {
            symbol: symbol as string
        }
    })

    res.send(JSON.parse(response));
})

tickerRouter.get('/currentPrice', async (req, res) => {
    const symbol = req.query.symbol
    const rabbitMqManager = new RabbitMqManager();
    await rabbitMqManager.connect();
    const response = await rabbitMqManager.sendAndAwait({
        type: GET_CURRENTPRICE,
        data: {
            symbol: symbol as string
        }
    })


    res.send(JSON.parse(response));
})