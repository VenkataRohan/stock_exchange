import { Router } from "express";
import { GET_BALANCE, ADD_BALANCE } from "../types";
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

    console.log(response);

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

    console.log(response);

    res.send(JSON.parse(response));
})