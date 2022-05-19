import { Router, Response } from "express";

const testRoutes = Router();

testRoutes.get("/test",
    (_, res: Response) => res.send("Hello, world")
);

export default testRoutes;