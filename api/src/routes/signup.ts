import { Router } from "express";
import { LOGIN, SIGNUP } from "../types";
import bcrypt from 'bcrypt';
import { RabbitMqManager } from "../RabbitMqManager";
import { Sign } from "crypto";
export const signupRouter = Router();

signupRouter.post('/', async (req, res) => {
    const { email, password, name } = req.body
    const hashedPassword = await bcrypt.hash(password, 10);

    // const rabbitMqManager = new RabbitMqManager();
    // await rabbitMqManager.connect();
    // const response = await rabbitMqManager.queryDb({
    //     type : SIGNUP,
    //     data : {
    //         name : name ,
    //         email : email,
    //         password : password
    //     }
    // })

    // console.log(response);

    // res.send(JSON.parse(response));
    res.send(hashedPassword);
})


signupRouter.post('/test', async (req, res) => {
    const { email, password, hashpass } = req.body
    const isMatch = await bcrypt.compare(password, hashpass);

    // const rabbitMqManager = new RabbitMqManager();
    // await rabbitMqManager.connect();
    // const response = await rabbitMqManager.queryDb({
    //     type : SIGNUP,
    //     data : {
    //         name : name ,
    //         email : email,
    //         password : password
    //     }
    // })

    // console.log(response);

    // res.send(JSON.parse(response));
    res.send(isMatch);
})