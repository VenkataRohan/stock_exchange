import { Router } from "express";
import { CANCEL_ORDER, CREATE_ORDER } from "../types";
import { RabbitMqManager } from "../RabbitMqManager";

export const orderRouter = Router()


orderRouter.get('/', async (req, res) => {
    res.json({order :"open order"});
})

orderRouter.post('/', async (req, res) => {
    const { orderType, symbol, price, quantity, side, userId } = req.body
    console.log(req.body);
    const rabbitMqManager = new RabbitMqManager();
    await rabbitMqManager.connect();
    const response = await rabbitMqManager.sendAndAwait({
        type : CREATE_ORDER,
        data : {
            orderType, 
            symbol,
            price,
            quantity,
            side,
            userId
        }
    })

    res.json(JSON.parse(response));
})

orderRouter.delete('/', async (req, res) => {
    const { orderType, symbol, price, quantity, side, userId } = req.body
    console.log(req.body);
    const rabbitMqManager = new RabbitMqManager();
    await rabbitMqManager.connect();
    const response = await rabbitMqManager.sendAndAwait({
        type : CANCEL_ORDER,
        data : {
            orderType, 
            symbol,
            price,
            quantity,
            side,
            userId
        }
    })

    res.json(JSON.parse(response));
})
