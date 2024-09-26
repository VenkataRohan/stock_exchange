import { Router } from "express";
import { GET_DEPTH, GET_TRADE } from "../types";
import { RabbitMqManager } from "../RabbitMqManager";
export const tradeRouter = Router();

tradeRouter.get('/', async (req, res) => {
    const symbol = req.query.symbol
    console.log(symbol);
    const rabbitMqManager = new RabbitMqManager();
    await rabbitMqManager.connect();
    const response = await rabbitMqManager.queryDb({
        type: GET_TRADE,
        data: {
            symbol: symbol as string
        }
    })

    console.log(response);

    res.send(JSON.parse(response));
})