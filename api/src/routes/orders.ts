import { Router } from "express";
import { KafkaManager } from "../KafkaManager";
import { CREATE_ORDER } from "../types";

export const orderRouter = Router()


orderRouter.get('/', async (req, res) => {
    res.json({order :"open order"});
})

orderRouter.post('/', async (req, res) => {
    const { orderType, symbol, price, quantity, side, userId } = req.body
    console.log(req.body);
    
    const response = await KafkaManager.getInstance().sendAndAwait({
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


