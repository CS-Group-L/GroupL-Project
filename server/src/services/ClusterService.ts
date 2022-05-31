import { existsSync, mkdirSync, PathLike } from 'fs';
import { rename as moveFile } from "fs/promises";
import { spawn } from 'child_process';
import { cwd } from 'process';
import EventEmitter from 'events';

if (!existsSync("./data")) mkdirSync("./data");

export const PushToCluster = async (filePath: PathLike): Promise<boolean> => {
    await moveFile(filePath, "./data/main.py");
    return true;
};

export const ConsoleOutput = new EventEmitter();
export let ConsoleOutputLog: Array<string> = [];

export const Execute = async () => {
    ConsoleOutputLog = [];
    const childProcess = spawn("python3.10", ["./data/main.py"], { cwd: cwd() });

    childProcess.stderr.on("data", (stream: Buffer) => {
        console.log(stream.toString());
    });

    childProcess.stdout.on("data", (stream: Buffer) => {
        const outputString = stream.toString();
        ConsoleOutputLog.push(outputString);
        ConsoleOutput.emit("data", outputString);
    });
};

export const GetEstimatedRunTime = async (): Promise<Number> => {
    return 0;
};