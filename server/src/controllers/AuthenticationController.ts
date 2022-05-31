import { Request, Response, Router } from "express";
import { DeleteUser, GetAllUsers, LoginUser, RegisterUser, UserExists } from '../services/AuthenticationService';
import { Send } from '../utils/Respond';
const AuthenticationController = Router();

AuthenticationController.get("/", async (_, res: Response) => {
    return Send(
        res,
        await GetAllUsers()
    );
});

AuthenticationController.post("/login", async (req: Request, res: Response) => {
    const response = await LoginUser(
        req.body.username,
        req.body.password
    );

    return Send(res, response);
});

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