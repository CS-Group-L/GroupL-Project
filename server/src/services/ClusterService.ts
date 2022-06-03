import { existsSync, mkdirSync, PathLike } from 'fs';
import { rename as moveFile } from "fs/promises";
import { ChildProcess, spawn, exec } from 'child_process';
import { cwd } from 'process';
import EventEmitter from 'events';
import { IServiceResponse, SR } from '../models/ResponseModel';
import { Stream } from 'stream';

const uploadsDir = "./data/uploads";

if (!existsSync("./data")) mkdirSync("./data");
if (!existsSync(uploadsDir)) mkdirSync(uploadsDir);

export const PushToCluster = async (filePath: PathLike): Promise<IServiceResponse<boolean | void>> => {
    try {
        await moveFile(filePath, `${uploadsDir}/main.py`);
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

    const childProcess = spawn("python3.10", [`${uploadsDir}/main.py`], { cwd: cwd() });

    childProcess.stderr.on("data", (stream: Buffer) => {
        console.log(stream.toString());
    });

    childProcess.stdout.on("data", (stream: Buffer) => {
        const outputString = stream.toString();
        ConsoleOutputLog.push(outputString);
        ConsoleOutput.emit("data", outputString);
    });

    return SR.data(true);
};

export const GetRunningStatus = async (): Promise<boolean> => {
    return (currentProcess || { exitCode: 1 }).exitCode !== null;
};

export const GetEstimatedRunTime = async (): Promise<Number> => {
    return 0;
};