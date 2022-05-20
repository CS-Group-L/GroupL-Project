import { Router, Response } from "express";
import { appendFile } from "fs";

const router_test = Router();

router_test.get("/test1", 
    function (_, res: Response) {
        res.send("new test!");
    }
)

export default router_test;