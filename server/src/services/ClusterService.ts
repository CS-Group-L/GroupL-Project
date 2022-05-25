import { existsSync, mkdirSync, PathLike } from 'fs';
import { rename as moveFile } from "fs/promises";
import { spawn } from 'child_process';
import { cwd } from 'process';

if (!existsSync("./data")) mkdirSync("./data");

export const PushToCluster = async (filePath: PathLike): Promise<boolean> => {
    await moveFile(filePath, "./data/main.py");
    return true;
};

let currentConsoleOutput: Array<string> = [];
export const Execute = async () => {
    currentConsoleOutput = [];
    const childProcess = spawn("python3.10", ["./data/main.py"], { cwd: cwd() });

    //./data/main.py
    childProcess.stderr.on("data", (stream: Buffer) => {
        console.log(stream.toString());
    });

    childProcess.stdout.on("data", (stream: Buffer) => {
        currentConsoleOutput.push(stream.toString());
        //consoleOutputCallback?.(stream.toString());
    });

    console.log(childProcess.exitCode);
};

export const GetEstimatedRunTime = async (): Promise<Number> => {
    return 0;
};

export const GetConsoleLog = async (): Promise<Array<string>> => {
    return currentConsoleOutput;
};