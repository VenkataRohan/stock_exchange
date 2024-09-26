import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express';


export function authenticateToken(req: any, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401); // Unauthorized
    }

    const resp: any = jwt.verify(token, 'shhhhh')

    if (resp.err) {
        return res.sendStatus(403); // Forbidden (invalid or expired token)
    }
    if (resp.userId != req.body.userId) {
        return res.sendStatus(403);
    }
    req.userId = resp.userId;

    next();
}