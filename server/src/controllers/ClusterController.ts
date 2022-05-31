import { Router, Request, Response } from "express";
import { UploadedFile } from 'express-fileupload';
import { open } from 'fs/promises';
import path from 'path';
import { Socket, Server as WsServer } from 'socket.io';
import { Execute, PushToCluster, ConsoleOutput, ConsoleOutputLog } from '../services/ClusterService';
import { Send } from '../utils/Respond';

export default (io: WsServer) => {
    const ClusterController = Router();
    const ClusterIO = io.of("Cluster");

    ClusterController.post("/push", async (req: Request, res: Response) => {
        if (!req?.files?.file) return res.status(403).end("No file uploaded");

        const file = req.files.file as UploadedFile;
        if (path.extname(file.name) !== ".py") return res.status(403).end("The uploaded file must be a Python file");

        const pushResponse = await PushToCluster(file.tempFilePath);
        if (pushResponse.isError) return Send(res, pushResponse);

        return Send(res, await Execute());
    });

    ClusterController.post("/pushcode", async (req: Request, res: Response) => {
        if (!req.body.code) return res.status(403).end("Body is required to have a key of code with contents that are not null");
        const tempFilePath = `./${Math.floor(Math.random() * 100000000)}.py`;

        try {
            const file = await open(tempFilePath, "w");
            await file.writeFile(req.body.code);
            await file.close();
        } catch (error) {
            return res.status(500).end("Server failed to push code");
        }

        const pushResponse = await PushToCluster(tempFilePath);
        if (pushResponse.isError) return Send(res, pushResponse);

        return Send(res, await Execute());
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