import { Router, Request, Response } from "express";
import { UploadedFile } from 'express-fileupload';
import { open as openFile } from 'fs/promises';
import { ClusterService } from '../services/ClusterService';
import { ClusterPushCodeValidator, ClusterPushValidator } from '../validators/ClusterValidators';
import { Send } from '../utils/Respond';
import { Socket, Server as wsServer } from "socket.io";
import { corsOptions, server } from '../..';
import socketioJwt from "socketio-jwt";
import authenticate from '../middleware/authenticate';

const service = new ClusterService({
    storagePath: "./data/uploads"
});

const ClusterController = Router();
const ClusterIO = new wsServer(server, { cors: corsOptions, path: "/cluster/output" });
ClusterIO.use(socketioJwt.authorize({
    secret: process.env.ACCESS_TOKEN_SECRET,
    handshake: true
}));
ClusterController.post("/push", authenticate, ClusterPushValidator, async (req: Request, res: Response) => {
    const file = req.files.file as UploadedFile;
    const pushResponse = await service.PushToCluster(file.tempFilePath);
    if (pushResponse.isError) return Send(res, pushResponse);

    return Send(res, await service.Execute());
});

ClusterController.post("/pushcode", authenticate, ClusterPushCodeValidator, async (req: Request, res: Response) => {
    const tempFilePath = `./${Math.floor(Math.random() * 100000000)}.py`;

    try {
        const file = await openFile(tempFilePath, "w");
        await file.writeFile(req.body.code);
        await file.close();
    } catch (error) {
        return res.status(500).end("Server failed to push code");
    }

    const pushResponse = await service.PushToCluster(tempFilePath);
    if (pushResponse.isError) return Send(res, pushResponse);

    return Send(res, await service.Execute());
});

ClusterIO.on("connection", (socket: Socket) => {
    const ConsoleOutput = service.ConsoleOutput;

    const OnFinishHandler = () => socket.emit("exit");
    const OutputReceptionHandler = (output: string) => socket.emit("output", output);

    ConsoleOutput.on("data", OutputReceptionHandler);
    ConsoleOutput.on("exit", OnFinishHandler);

    socket.on("getrunningstatus", async (callback) => callback?.(await service.GetRunningStatus()));
    socket.on("getall", async (callback) => callback?.(service.ConsoleOutputLog));

    socket.on("disconnect", () => {
        ConsoleOutput.off("exit", OnFinishHandler);
        ConsoleOutput.off("data", OutputReceptionHandler);
    });
});

export default ClusterController;