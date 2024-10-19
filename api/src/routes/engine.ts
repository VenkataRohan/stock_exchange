import { Router } from "express";
import { GET_COMPLETE_BALANCES } from "../types";
import { RabbitMqManager } from "../RabbitMqManager";
export const engineRouter = Router();

engineRouter.get('/getBalances',async(req,res)=>{
    const symbol = req.query.symbol
    const rabbitMqManager = new RabbitMqManager();
    await rabbitMqManager.connect();
    const response = await rabbitMqManager.queryDb({
        type : GET_COMPLETE_BALANCES,
        data : {}
    })
    
    res.send(JSON.parse(response));
})