import { Router, Request, Response } from "express";
import { UploadedFile } from 'express-fileupload';
import { open as openFile } from 'fs/promises';
import { ClusterService } from '../services/ClusterService';
import { ClusterPushCodeValidator, ClusterPushValidator } from '../validators/ClusterValidators';
import { Send } from '../utils/Respond';
import authenticate from '../middleware/authenticate';

const service = new ClusterService({
    storagePath: "./data/uploads"
});

const ClusterController = Router();

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

ClusterController.get("/isRunning", authenticate, async (req: Request, res: Response) => {
    res.send(JSON.stringify({
        isRunning: await service.GetRunningStatus()
    }));
});

ClusterController.get("/output", authenticate, async (req: Request, res: Response) => {
    res.send(JSON.stringify({
        output: service.ConsoleOutputLog
    }));
});

export default ClusterController;