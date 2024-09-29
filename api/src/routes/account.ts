import { Router } from "express";
import { GET_BALANCE, ADD_BALANCE, GET_STOCK_BALANCE, GET_ALL_STOCK_BALANCE } from "../types";
import { RabbitMqManager } from "../RabbitMqManager";
export const accountRouter = Router();

accountRouter.post('/balance', async (req, res) => {
    const { userId } = req.body
    console.log(req.body);

    const rabbitMqManager = new RabbitMqManager();
    await rabbitMqManager.connect();
    const response = await rabbitMqManager.sendAndAwait({
        type: GET_BALANCE,
        data: {
            userId: userId
        }
    })
    res.send(JSON.parse(response));
})

accountRouter.post('/stock_balance', async (req, res) => {
    const { userId, symbol } = req.body
    console.log(req.body);

    const rabbitMqManager = new RabbitMqManager();
    await rabbitMqManager.connect();
    const response = await rabbitMqManager.sendAndAwait({
        type: GET_STOCK_BALANCE,
        data: {
            userId: userId,
            symbol: symbol
        }
    })

    res.send(JSON.parse(response));
})

accountRouter.post('/all_stock_balance', async (req, res) => {
    const { userId, symbols } = req.body
    console.log(req.body);

    const rabbitMqManager = new RabbitMqManager();
    await rabbitMqManager.connect();
    const response = await rabbitMqManager.sendAndAwait({
        type: GET_ALL_STOCK_BALANCE,
        data: {
            userId: userId,
            symbols: symbols
        }
    })

    res.send(JSON.parse(response));
})

accountRouter.post('/add_balance', async (req, res) => {
    const { userId, amount } = req.body

    const rabbitMqManager = new RabbitMqManager();
    await rabbitMqManager.connect();
    const response = await rabbitMqManager.sendAndAwait({
        type: ADD_BALANCE,
        data: {
            userId: userId,
            amount: amount,
        }
    })
    res.send(JSON.parse(response));
})