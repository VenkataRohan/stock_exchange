import { Router } from "express";
import { GET_TICKER } from "../types";
import { RabbitMqManager } from "../RabbitMqManager";
export const tickerRouter = Router();

tickerRouter.get('/', async (req, res) => {
    const symbol = req.query.symbol
    console.log(symbol);
    const rabbitMqManager = new RabbitMqManager();
    await rabbitMqManager.connect();
    const response = await rabbitMqManager.queryDb({
        type: GET_TICKER,
        data: {
            symbol: symbol as string
        }
    })

    console.log(response);

    res.send(JSON.parse(response));
})