import { Router } from "express";
import { GET_CURRENTPRICE, GET_DAILY_STOCK_STATS, GET_TICKER } from "../types";
import { RabbitMqManager } from "../RabbitMqManager";
export const stockStatsRouter = Router();

stockStatsRouter.get('/', async (req, res) => {
    const symbols = req.query.symbol as string
    const symbols_arr = symbols.split(',').map(e  => e.trim());
    console.log(symbols);
    const rabbitMqManager = new RabbitMqManager();
    await rabbitMqManager.connect();
    const response = await rabbitMqManager.queryDb({
        type: GET_DAILY_STOCK_STATS,
        data: {
            symbols : symbols_arr
        }
    })

    res.send(JSON.parse(response));
})

stockStatsRouter.get('/currentPrice', async (req, res) => {
    const symbol = req.query.symbol
    console.log(symbol);
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