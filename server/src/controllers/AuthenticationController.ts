//requie('dotenv').config();

import { Request, Response, Router, NextFunction } from "express";
import { DeleteUser, GetAllUsers, verifyToken, LoginUser, RegisterUser, UserExists } from '../services/AuthenticationService';
import { Send } from '../utils/Respond';

const AuthenticationController = Router();

AuthenticationController.get("/", autenticationToken, async (_, res: Response) => {
    return Send(
        res,
        await GetAllUsers()
    );
});

AuthenticationController.post("/login", async (req: Request, res: Response) => {
    const username = req.body.username;
    const password = req.body.password;
    const response = await LoginUser(
        username,
        password
    );

    return Send(res, response);
});

function autenticationToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    verifyToken(token)
        .catch((err) => console.log(err))
        .then((data) => {
            req.body.username = data
            next()
        });
}


AuthenticationController.post("/register", async (req: Request, res: Response) => {
    const response = await RegisterUser(
        req.body.username,
        req.body.password,
        req.body.confPassword
    );

    return Send(res, response);
});

AuthenticationController.delete("/:username", async (req: Request, res: Response) => {
    const response = await DeleteUser(
        req.params.username
    );

    return Send(res, response);
});

AuthenticationController.get("/:username/has-dashboard-access", async (req: Request, res: Response) => {
    return Send(
        res,
        await UserExists(req.params.username)
    );
});

export default AuthenticationController;