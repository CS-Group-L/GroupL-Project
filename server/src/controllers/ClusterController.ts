import { Router, Request, Response } from "express";
import { UploadedFile } from 'express-fileupload';
import { open } from 'fs/promises';
import path from 'path';
import { Execute, GetConsoleLog, PushToCluster } from '../services/ClusterService';
const ClusterController = Router();

ClusterController.post("/push", async (req: Request, res: Response) => {
    if (!req.files) return res.sendStatus(400);
    const file = req.files.file as UploadedFile;
    if (!file ?? path.extname(file.name) !== "py") return res.sendStatus(400);

    const uploaded = await PushToCluster(file.tempFilePath);

    if (!uploaded) return res.sendStatus(500);
    Execute();
    return res.sendStatus(200);
});

ClusterController.post("/pushcode", async (req: Request, res: Response) => {
    if (!req.body.code) return res.sendStatus(400);
    const tempFilePath = `./${Math.floor(Math.random() * 100000000)}.py`;

    const file = await open(tempFilePath, "w");
    await file.writeFile(req.body.code);
    await file.close();
    const uploaded = await PushToCluster(tempFilePath);

    if (!uploaded) return res.sendStatus(500);
    Execute();
    return res.sendStatus(200);
});

ClusterController.get("/output", async (req: Request, res: Response) => {
    return res.send(
        JSON.stringify(await GetConsoleLog())
    );
});

export default ClusterController;