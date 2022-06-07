import { Request, Response, Router, NextFunction } from "express";
import { DeleteUser, GetAllUsers, verifyAccessToken, LoginUser, RegisterUser, UserExists } from '../services/AuthenticationService';
import { deleteUserValidator, hasAccessValidator, loginValidator, registerValidator } from '../validators/AuthenticationValidators';
import { Send } from '../utils/Respond';
import authenticate from '../middleware/authenticate';


const AuthenticationController = Router();

AuthenticationController.get("/", authenticate, async (_, res: Response) => {
    return Send(
        res,
        await GetAllUsers()
    );
});

AuthenticationController.post("/login", loginValidator, async (req: Request, res: Response) => {
    const username = req.body.username;
    const password = req.body.password;
    const response = await LoginUser(
        username,
        password
    );

    return Send(res, response);
});

AuthenticationController.post("/register", registerValidator, async (req: Request, res: Response) => {
    const response = await RegisterUser(
        req.body.username,
        req.body.password,
        req.body.confPassword
    );

    return Send(res, response);
});

AuthenticationController.delete("/:username", deleteUserValidator, async (req: Request, res: Response) => {
    const response = await DeleteUser(
        req.params.username
    );

    return Send(res, response);
});

AuthenticationController.get("/:username/has-dashboard-access", hasAccessValidator, async (req: Request, res: Response) => {
    return Send(
        res,
        await UserExists(req.params.username)
    );
});

export default AuthenticationController;