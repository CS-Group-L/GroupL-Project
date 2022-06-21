import { PathLike, mkdirSync } from 'fs';
import { rename as moveFile } from "fs/promises";
import { ChildProcess, spawn } from 'child_process';
import { cwd } from 'process';
import EventEmitter from 'events';
import { IServiceResponse, SR } from '../models/ResponseModel';

interface IClusterOptions {
    storagePath: PathLike;
}

export class ClusterService {
    private storagePath: PathLike;
    private storageMainFile: PathLike;
    private currentProcess: ChildProcess = null;
    public ConsoleOutput = new EventEmitter();
    public ConsoleOutputLog: Array<string> = [];

    constructor(config: IClusterOptions) {
        this.storagePath = config.storagePath;
        this.storageMainFile = `${config.storagePath}/main.py`;
        mkdirSync(this.storagePath, { recursive: true });
    }

    public PushToCluster = async (filePath: PathLike): Promise<IServiceResponse<boolean | void>> => {
        try {
            await moveFile(filePath, this.storageMainFile);
            return SR.data(true);
        } catch (error) {
            return SR.error(500, "Internal Server Error");
        }
    };

    public Execute = async (): Promise<IServiceResponse<boolean | void>> => {
        this.ConsoleOutputLog = [];
        if (this.currentProcess && !this.currentProcess.kill()) {
            return SR.error(500, "Server failed to stop previously running process");
        }

        const childProcess = spawn("python3.10", [this.storageMainFile.toString()], { cwd: cwd(), env: process.env, stdio: ["ignore", "pipe", "ignore"] });

        childProcess.stdout.on("data", (buffer: Buffer) => {
            const outputStr = buffer.toString();
            this.ConsoleOutputLog.push(outputStr);
            this.ConsoleOutput.emit("data", outputStr);
        });

        childProcess.on(
            "exit",
            () => this.ConsoleOutput.emit("exit")
        );

        this.currentProcess = childProcess;
        return SR.data(true);
    };

    public GetRunningStatus = async (): Promise<boolean> => {
        if (!this.currentProcess) {
            return false;
        }

        console.log(this.currentProcess.exitCode);

        return this.currentProcess.exitCode === null;
    };

    public GetEstimatedRunTime = async (): Promise<Number> => {
        return 0;
    };
}