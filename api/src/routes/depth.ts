import { Router } from "express";
import { GET_DEPTH } from "../types";
import { RabbitMqManager } from "../RabbitMqManager";
export const depthRouter = Router();

depthRouter.get('/',async(req,res)=>{
    const symbol = req.query.symbol
    const rabbitMqManager = new RabbitMqManager();
    await rabbitMqManager.connect();
    const response = await rabbitMqManager.sendAndAwait({
        type : GET_DEPTH,
        data : {
            symbol : symbol as string
        }
    })
    
    res.send(JSON.parse(response));
})