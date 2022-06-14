import { NextFunction, Request, Response } from 'express';
import { Socket } from 'socket.io';
import { AuthService } from '../services/AuthenticationService';
const service = new AuthService({
    storagePath: "./data/users",
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET
});

interface IAuthenticationData {
    [key: string]: string;
}
declare module "express" {
    interface Request {
        auth?: IAuthenticationData;
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
    try {
        const data = await service.VerifyAccessToken(token);
        req.auth = data;
        next();
    }
    catch {
        res.sendStatus(401);
    }
};

export default authenticate;