import { Router } from "express";
import { LOGIN } from "../types";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RabbitMqManager } from "../RabbitMqManager";
export const loginRouter = Router();

loginRouter.post('/', async (req, res) => {
    const { email, password } = req.body
    console.log(email);

    const rabbitMqManager = new RabbitMqManager();
    await rabbitMqManager.connect();
    const response = await rabbitMqManager.queryDb({
        type: LOGIN,
        data: {
            email: email,
            password: password
        }
    })

    const isMatch = await bcrypt.compare(password, JSON.parse(response).password);
    if (isMatch) {
        var token = jwt.sign({ userId: JSON.parse(response).id }, 'shhhhh');
        return res.json({ token });
    }


    res.status(400).send({ "msg": "password did not match" });
})