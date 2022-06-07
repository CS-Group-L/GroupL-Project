import { Router, Request, Response } from "express";
import { UploadedFile } from 'express-fileupload';
import { open as openFile } from 'fs/promises';
import { Execute, PushToCluster, ConsoleOutput, ConsoleOutputLog, GetRunningStatus } from '../services/ClusterService';
import { ClusterPushCodeValidator, ClusterPushValidator } from '../validators/ClusterValidators';
import { Send } from '../utils/Respond';
import { Socket, Server as wsServer } from "socket.io";
import { corsOptions, server } from '../..';
export default () => {

    const ClusterController = Router();
    const ClusterIO = new wsServer(server, { cors: corsOptions, path: "/cluster/output" });

    ClusterController.post("/push", ClusterPushValidator, async (req: Request, res: Response) => {
        const file = req.files.file as UploadedFile;
        const pushResponse = await PushToCluster(file.tempFilePath);
        if (pushResponse.isError) return Send(res, pushResponse);

        return Send(res, await Execute());
    });

    ClusterController.post("/pushcode", ClusterPushCodeValidator, async (req: Request, res: Response) => {
        const tempFilePath = `./${Math.floor(Math.random() * 100000000)}.py`;

        try {
            const file = await openFile(tempFilePath, "w");
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
        const OnFinishHandler = () => socket.emit("exit");
        const OutputReceptionHandler = (output: string) => socket.emit("output", output);

        ConsoleOutput.on("data", OutputReceptionHandler);
        ConsoleOutput.on("exit", OnFinishHandler);

        socket.on("getrunningstatus", async (callback) => callback?.(await GetRunningStatus()));
        socket.on("getall", async (callback) => callback?.(ConsoleOutputLog));

        socket.on("disconnect", () => {
            ConsoleOutput.off("exit", OnFinishHandler);
            ConsoleOutput.off("data", OutputReceptionHandler);
        });
    });

    return ClusterController;
};