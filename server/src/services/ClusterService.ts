import { existsSync, mkdirSync, PathLike } from 'fs';
import { open as openFile, rename as moveFile } from "fs/promises";
import { ChildProcess, spawn } from 'child_process';
import { cwd } from 'process';
import EventEmitter from 'events';
import { IServiceResponse, SR } from '../models/ResponseModel';

const uploadsDir = "./data/uploads";
const uploadMainFile = `${uploadsDir}/main.py`;

if (!existsSync("./data")) mkdirSync("./data");
if (!existsSync(uploadsDir)) mkdirSync(uploadsDir);

export const PushToCluster = async (filePath: PathLike): Promise<IServiceResponse<boolean | void>> => {
    try {
        await moveFile(filePath, uploadMainFile);
        return SR.data(true);
    } catch (error) {
        return SR.error(500, "Internal Server Error");
    }
};

export const ConsoleOutput = new EventEmitter();
export let ConsoleOutputLog: Array<string> = [];
let currentProcess: ChildProcess = null;

export const Execute = async (): Promise<IServiceResponse<boolean | void>> => {
    ConsoleOutputLog = [];
    if (currentProcess && !currentProcess.kill()) {
        return SR.error(500, "Server failed to stop previously running process");
    }

    const childProcess = spawn("python3.10", [uploadMainFile], { cwd: cwd(), env: process.env, stdio: ["ignore", "inherit", "ignore"] });

    childProcess.on("data", (buffer: Buffer) => {
        const outputStr = buffer.toString();
        ConsoleOutputLog.push(outputStr);
        ConsoleOutput.emit("data", outputStr);
    });

    childProcess.on(
        "exit",
        () => ConsoleOutput.emit("exit")
    );

    return SR.data(true);
};

export const GetRunningStatus = async (): Promise<boolean> => {
    return (currentProcess || { exitCode: 1 }).exitCode !== null;
};

export const GetEstimatedRunTime = async (): Promise<Number> => {
    return 0;
};