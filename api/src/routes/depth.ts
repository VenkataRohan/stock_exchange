import { Router } from "express";
import { Kafka } from "kafkajs";
import { KafkaManager } from "../KafkaManager";
import { GET_DEPTH } from "../types";

export const depthRouter = Router();

depthRouter.get('/',async(req,res)=>{
    const symbol = req.query.symbol
    console.log(symbol);
    
   const resp  = await KafkaManager.getInstance().sendAndAwait({
        type : GET_DEPTH,
        data : {
            symbol : symbol as string
        }
    })
    console.log(resp);
    
    res.send(JSON.parse(resp));
})