import { Request, Response, Router } from "express";
import { DeleteUser, GetAllUsers, LoginUser, RegisterUser } from '../services/AuthenticationService';
const AuthenticationController = Router();

AuthenticationController.get("/", async (_, res: Response) => {
    const users = await GetAllUsers();

    return res.send(users);
});

AuthenticationController.post("/login", async (req: Request, res: Response) => {
    const loggedInUser = await LoginUser(
        req.body.username,
        req.body.password
    );
    return res.send(loggedInUser);
});

AuthenticationController.post("/register", async (req: Request, res: Response) => {
    const success = await RegisterUser(
        req.body.username,
        req.body.password,
        req.body.confPassword

    );

    if (success) {
        return res.sendStatus(200);
    }
    return res.sendStatus(500);
});

AuthenticationController.delete("/:username", async (req: Request, res: Response) => {
    const success = await DeleteUser(
        req.params.username
    );

    if (success) {
        return res.sendStatus(200);
    }
    return res.sendStatus(500);
});

AuthenticationController.get("/:username/has-dashboard-access",  async (req: Request, res: Response) => {
    req.query.id
});

export default AuthenticationController;