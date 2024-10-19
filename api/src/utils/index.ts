import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
    userId?: string;
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401); 
    }

    try {
        const secretKey = process.env.JWT_SECRECT as string;
        const decoded = jwt.verify(token, secretKey) as JwtPayload;
        
        // if (decoded && decoded.userId !== req.body.userId) {
        //     return res.sendStatus(403); 
        // }

        req.userId = decoded.userId; 
        next();
    } catch (err) {
        return res.sendStatus(403); 
    }
}