import { NextFunction, Request, Response } from 'express';
import { Socket } from 'socket.io';
import { verifyAccessToken } from '../services/AuthenticationService';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
    try {
        const data = await verifyAccessToken(token);
        req.body.username = data;
        next();
    }
    catch {
        res.sendStatus(401);
    }
};

export default authenticate;