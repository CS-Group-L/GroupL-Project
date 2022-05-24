import { Request, Response, Router } from "express";
import { DeleteUser, GetAllUsers, LoginUser, RegisterUser } from '../services/AuthenticationService';
const AuthenticationController = Router();

AuthenticationController.get("/", async (_, res: Response) => {
    const users = await GetAllUsers()
        .catch(() => res.sendStatus(500));

    return res.send(users);
});

AuthenticationController.post("/login", async (req: Request, res: Response) => {
    const loggedInUser = await LoginUser(
        req.body.username,
        req.body.password
    ).catch((err: Error) => {
        return res.status(parseInt(err.name)).send()
    });
    return res.send(loggedInUser);
});

AuthenticationController.post("/register", async (req: Request, res: Response) => {
    const success = await RegisterUser(
        req.body.username,
        req.body.password
    ).catch((err: Error) =>
        res.sendStatus(parseInt(err.message))
    );

    if (success) {
        return res.sendStatus(200);
    }
    return res.sendStatus(500);
});

AuthenticationController.delete("/:username", async (req: Request, res: Response) => {
    const success = await DeleteUser(
        req.params.username
    ).catch((err: Error) =>
        res.sendStatus(parseInt(err.message))
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