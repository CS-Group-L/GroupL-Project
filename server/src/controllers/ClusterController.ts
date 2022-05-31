import { Router, Request, Response } from "express";
import { UploadedFile } from 'express-fileupload';
import { open } from 'fs/promises';
import path from 'path';
import { Socket, Server as WsServer } from 'socket.io';
import { Execute, PushToCluster, ConsoleOutput, ConsoleOutputLog } from '../services/ClusterService';

export default (io: WsServer) => {
    const ClusterController = Router();
    const ClusterIO = io.of("Cluster");

    ClusterController.post("/push", async (req: Request, res: Response) => {
        if (!req?.files?.file) return res.sendStatus(400);

        const file = req.files.file as UploadedFile;
        if (path.extname(file.name) !== ".py") return res.sendStatus(400);

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

    ClusterIO.on("connection", (socket: Socket) => {
        const OutputReceptionHandler = (output: string) => socket.emit("output", output);
        ConsoleOutput.on("data", OutputReceptionHandler);

        socket.on("all-output", () => ConsoleOutputLog);

        socket.on("disconnect", () => {
            ConsoleOutput.off("data", OutputReceptionHandler);
        });
    });

    return ClusterController;
};