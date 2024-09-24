import { Router } from "express";
import { CANCEL_ORDER, CREATE_ORDER, GET_ORDER, messageFromEngine } from "../types";
import { RabbitMqManager } from "../RabbitMqManager";

export const orderRouter = Router()


orderRouter.get('/', async (req, res) => {
    const {userId } = req.query
    console.log(userId);
    
    const rabbitMqManager = new RabbitMqManager();
    await rabbitMqManager.connect();
    const response : messageFromEngine = JSON.parse(await rabbitMqManager.sendAndAwait({
        type : GET_ORDER,
        data : {
            userId : userId as string,
        }
    }))
    res.json(response);
})

orderRouter.post('/', async (req, res) => {
    const { orderType, symbol, price, quantity, side, userId } = req.body
    console.log(req.body);
    const rabbitMqManager = new RabbitMqManager();
    await rabbitMqManager.connect();
    const response : messageFromEngine = JSON.parse(await rabbitMqManager.sendAndAwait({
        type : CREATE_ORDER,
        data : {
            orderType, 
            symbol,
            price,
            quantity,
            side,
            userId
        }
    }))
    if(response.type === "ERROR"){
        return res.status(400).json({msg :response.data.msg,id:"hgfjfj"})
    }
    return res.json(response);
})

orderRouter.delete('/', async (req, res) => {
    const { orderId, symbol} = req.body
    console.log(req.body);
    const rabbitMqManager = new RabbitMqManager();
    await rabbitMqManager.connect();
    const response = await rabbitMqManager.sendAndAwait({
        type : CANCEL_ORDER,
        data : {
            orderId, 
            symbol,
        }
    })

    res.json(JSON.parse(response));
})
