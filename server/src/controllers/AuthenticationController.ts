import { Request, Response, Router, NextFunction } from "express";
import { AuthService } from '../services/AuthenticationService';
import { deleteUserValidator, hasAccessValidator, loginValidator, registerValidator } from '../validators/AuthenticationValidators';
import { Send, sendData } from '../utils/Respond';
import authenticate from '../middleware/authenticate';

const AuthenticationController = Router();
const service = new AuthService({
    storagePath: "./data/users",
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET
});

AuthenticationController.get("/", authenticate, async (_, res: Response) => {
    return Send(
        res,
        await service.GetAllUsers()
    );
});

AuthenticationController.post("/login", loginValidator, async (req: Request, res: Response) => {
    const username = req.body.username;
    const password = req.body.password;
    const response = await service.LoginUser(
        username,
        password
    );

    return Send(res, response);
});

AuthenticationController.post("/register", authenticate, registerValidator, async (req: Request, res: Response) => {
    const response = await service.RegisterUser(
        req.body.username,
        req.body.password,
        req.body.confPassword
    );

    return Send(res, response);
});

AuthenticationController.post("/changepass", authenticate, async (req: Request, res: Response) => {
    const response  = await service.changePassword(
        req.body.username,
        req.body.oldPass,
        req.body.newPass,
        req.body.confPass
    );

    return Send(res, response);
})

AuthenticationController.delete("/:username", authenticate, deleteUserValidator, async (req: Request, res: Response) => {
    const response = await service.DeleteUser(
        req.params.username
    );

    return Send(res, response);
});

AuthenticationController.get("/exists/:username", authenticate, hasAccessValidator, async (req: Request, res: Response) => {
    return Send(
        res,
        await service.UserExists(req.params.username)
    );
});

export default AuthenticationController;